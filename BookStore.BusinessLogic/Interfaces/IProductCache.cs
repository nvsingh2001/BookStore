using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IProductCache
{
    Task<ProductResponseDto?> GetProductAsync(Guid productId);
    Task SetProductAsync(Guid productId, ProductResponseDto product);
    Task<List<ProductResponseDto>?> GetProductsAsync();
    Task SetProductsAsync(List<ProductResponseDto> products);
    Task InvalidateProductCacheAsync(Guid productId);
    Task InvalidateAllProductsCacheAsync();
}