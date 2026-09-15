using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    protected string CurrentUserEmail => User.FindFirstValue(ClaimTypes.Email)!;
    protected string? CurrentTokenJti => User.FindFirstValue(JwtRegisteredClaimNames.Jti);

    protected DateTimeOffset CurrentTokenExpiresAt => DateTimeOffset
        .FromUnixTimeSeconds(long.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Exp)!));
}