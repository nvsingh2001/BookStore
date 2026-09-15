using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BookStore.BusinessLogic.Services;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;
    private readonly RsaSecurityKey _privateKey;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
        var rsa = RSA.Create();
        rsa.ImportFromPem(File.ReadAllText(_configuration["JwtSettings:PrivateKey"] ?? ""));
        _privateKey = new RsaSecurityKey(rsa);
    }

    public string GenerateToken(Guid userId, string email, UserRole role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            _configuration["JwtSettings:Issuer"],
            _configuration["JwtSettings:Audience"],
            claims,
            expires: DateTime.UtcNow.AddHours(int.Parse(_configuration["JwtSettings:ExpirationHours"] ?? "")),
            signingCredentials: new SigningCredentials(_privateKey, SecurityAlgorithms.RsaSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}