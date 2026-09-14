using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using BookStore;
using BookStore.BusinessLogic.Interfaces;
using BookStore.BusinessLogic.Mapping;
using BookStore.BusinessLogic.Services;
using BookStore.DataAccess;
using BookStore.DataAccess.Interfaces;
using BookStore.DataAccess.Repositories;
using BookStore.DomainModel.Utilities;
using BookStore.Infrastructure.Caching;
using BookStore.Infrastructure.Email;
using BookStore.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using NLog;
using NLog.Web;
using StackExchange.Redis;

var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("Initializing application");

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(entry => entry.Value?.Errors.Count > 0)
                .SelectMany(entry => entry.Value!.Errors.Select(error => error.ErrorMessage))
                .ToArray();

            return new BadRequestObjectResult(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        };
    });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "BookStore", Version = "v1" });

        options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Enter your JWT token (without the 'Bearer ' prefix)"
        });

        options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("bearer", document)] = []
        });
    });

    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IAdminRepository, AdminRepository>();
    builder.Services.AddScoped<IProductRepository, ProductRepository>();
    builder.Services.AddScoped<IOrderRepository, OrderRepository>();
    builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
    builder.Services.AddScoped<IWishlistItemRepository, WishlistItemRepository>();
    builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
    builder.Services.AddScoped<ICustomerAddressRepository, CustomerAddressRepository>();

    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IAdminService, AdminService>();
    builder.Services.AddScoped<IOrderService, OrderService>();
    builder.Services.AddScoped<IWishlistItemService, WishlistItemService>();
    builder.Services.AddScoped<IProductService, ProductService>();
    builder.Services.AddScoped<IFeedbackService, FeedbackService>();
    builder.Services.AddScoped<ICartItemService, CartItemService>();
    builder.Services.AddScoped<ICustomerAddressService, CustomerAddressService>();
    builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

    builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
    builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
    builder.Services.AddSingleton<IEmailVerificationTokenService, EmailVerificationTokenService>();
    builder.Services.AddSingleton<IPasswordResetTokenService, PasswordResetTokenService>();

    builder.Services.AddAutoMapper(cfg => cfg.AddMaps(typeof(UserProfile)));

    var redisOptions = ConfigurationOptions.Parse(builder.Configuration["Redis:ConnectionString"] ?? "");
    redisOptions.AbortOnConnectFail = false;
    builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisOptions));
    builder.Services.AddSingleton<ITokenBlockList, RedisTokenBlocklist>();
    builder.Services.AddSingleton<IProductCache, RedisProductCache>();
    builder.Services.AddSingleton<IEmailSender, MailKitEmailSender>();

    var rsa = RSA.Create();
    rsa.ImportFromPem(File.ReadAllText(builder.Configuration["JwtSettings:PublicKey"] ?? ""));
    var publicKey = new RsaSecurityKey(rsa);

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration.GetSection("JwtSettings:Issuer").Value,
            ValidAudience = builder.Configuration.GetSection("JwtSettings:Audience").Value,
            IssuerSigningKey = publicKey
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var jti = context.Principal?.FindFirstValue(JwtRegisteredClaimNames.Jti);
                if (jti is null) return;

                var blocklist = context.HttpContext.RequestServices.GetRequiredService<ITokenBlockList>();
                if (await blocklist.IsTokenBlockedAsync(jti)) context.Fail("Token has been revoked");
            }
        };
    });

    builder.Services.AddAuthorization();

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    var app = builder.Build();

    await AdminBootstrapper.EnsureBootstrapAdminAsync(app.Services);

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsProduction())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"); });
    }

    app.UseHttpsRedirection();

    app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    logger.Error(ex, "Stopped program because of exception");
    throw;
}
finally
{
    LogManager.Shutdown();
}