using System.Text.Json;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using StackExchange.Redis;

namespace BookStore.Infrastructure.Caching;

public class RedisProductCache(IConnectionMultiplexer multiplexer, ILogger<RedisProductCache> logger) : IProductCache
{
    private const string AllProductsKey = "product:all";
    private static readonly TimeSpan Ttl = TimeSpan.FromHours(1);

    private readonly IDatabase _db = multiplexer.GetDatabase();

    public async Task<ProductResponseDto?> GetProductAsync(Guid productId)
    {
        try
        {
            var value = await _db.StringGetAsync($"product:{productId}");
            return value.IsNullOrEmpty ? null : JsonSerializer.Deserialize<ProductResponseDto>((string)value!);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis read failed for product {ProductId} - falling back to a cache miss",
                productId);
            return null;
        }
    }

    public async Task SetProductAsync(Guid productId, ProductResponseDto product)
    {
        try
        {
            await _db.StringSetAsync($"product:{productId}", JsonSerializer.Serialize(product), Ttl);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis write failed for product {ProductId}", productId);
        }
    }

    public async Task<List<ProductResponseDto>?> GetProductsAsync()
    {
        try
        {
            var value = await _db.StringGetAsync(AllProductsKey);
            return value.IsNullOrEmpty ? null : JsonSerializer.Deserialize<List<ProductResponseDto>>((string)value!);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis read failed for products");
            return null;
        }
    }

    public async Task SetProductsAsync(List<ProductResponseDto> products)
    {
        try
        {
            await _db.StringSetAsync(AllProductsKey, JsonSerializer.Serialize(products), Ttl);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis write failed for products");
        }
    }

    public async Task InvalidateProductCacheAsync(Guid productId)
    {
        try
        {
            await _db.KeyDeleteAsync($"product:{productId}");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis invalidation failed for product {ProductId}", productId);
        }
    }

    public async Task InvalidateAllProductsCacheAsync()
    {
        try
        {
            await _db.KeyDeleteAsync(AllProductsKey);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Redis invalidation failed for products");
        }
    }
}