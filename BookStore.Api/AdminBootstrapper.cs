using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;

namespace BookStore;

public static class AdminBootstrapper
{
    public static async Task EnsureBootstrapAdminAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var adminRepository = scope.ServiceProvider.GetRequiredService<IAdminRepository>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        if (await adminRepository.AnyAdminExistsAsync())
            return;

        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var fullName = configuration["AdminBootstrap:FullName"];
        var email = configuration["AdminBootstrap:Email"];
        var phone = configuration["AdminBootstrap:Phone"];
        var password = configuration["AdminBootstrap:Password"];

        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning(
                "No admin exists and AdminBootstrap:FullName/Email/Phone/Password are not fully configured — skipping bootstrap admin creation");
            return;
        }

        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var admin = new Admin
        {
            Fullname = fullName,
            Email = email,
            Phone = phone,
            Password = passwordHasher.Hash(password)
        };

        await adminRepository.CreateAdminAsync(admin);

        logger.LogInformation("Created bootstrap admin account for {Email}", email);
    }
}
