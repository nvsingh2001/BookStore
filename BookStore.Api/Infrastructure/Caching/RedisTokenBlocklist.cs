using BookStore.BusinessLogic.Interfaces;
using StackExchange.Redis;

namespace BookStore.Infrastructure.Caching;

public class RedisTokenBlocklist(IConnectionMultiplexer multiplexer, ILogger<RedisTokenBlocklist> logger)
    : ITokenBlockList
{
    private readonly IDatabase _db = multiplexer.GetDatabase();

    public async Task<bool> IsTokenBlockedAsync(string jti)
    {
        try
        {
            var value = await _db.KeyExistsAsync($"blocklist:{jti}");
            return value;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis failed to verify if the token {Jti} is blocked.", jti);
            return false;
        }
    }

    public async Task BlockTokenAsync(string jti, TimeSpan ttl)
    {
        try
        {
            await _db.StringSetAsync($"blocklist:{jti}", "1", ttl);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis write failed while blocking the token {Jti}", jti);
        }
    }
}