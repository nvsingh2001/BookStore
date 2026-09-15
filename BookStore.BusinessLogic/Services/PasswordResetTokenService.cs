using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using BookStore.BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BookStore.BusinessLogic.Services;

public class PasswordResetTokenService : IPasswordResetTokenService
{
    private readonly IConfiguration _configuration;
    private readonly RsaSecurityKey _privateKey;


    public PasswordResetTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        var rsa = RSA.Create();
        rsa.ImportFromPem(File.ReadAllText(_configuration["JwtSettings:PrivateKey"] ?? ""));
        _privateKey = new RsaSecurityKey(rsa);
    }

    public string GenerateToken(Guid userId, string email)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim("Purpose", "reset_password")
        };

        var token = new JwtSecurityToken(
            _configuration["JwtSettings:Issuer"],
            _configuration["JwtSettings:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: new SigningCredentials(_privateKey, SecurityAlgorithms.RsaSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public Guid ValidateAndExtractUserId(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["JwtSettings:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _privateKey
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

        var purposeClaim = principal.FindFirst("Purpose");

        if (purposeClaim is null || purposeClaim.Value != "reset_password")
            throw new SecurityTokenException("Token is not valid to reset password");

        var idClaim = principal.FindFirst(ClaimTypes.NameIdentifier)
                      ?? throw new SecurityTokenException("Token missing user id claim");

        return Guid.Parse(idClaim.Value);
    }
}