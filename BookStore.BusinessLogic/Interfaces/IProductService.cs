using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IProductService
{
    Task<ProductResponseDto> CreateProductAsync(ProductRequestDto productRequestDto, Guid adminId);
    Task<ProductResponseDto> GetProductByIdAsync(Guid productId);
    Task<List<ProductResponseDto>> GetAllProductsAsync();
    Task<ProductResponseDto> UpdateProductAsync(Guid productId, ProductRequestDto productRequestDto);
    Task DeleteProductAsync(Guid productId);
}