using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IProductRepository
{
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> GetProductByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product> UpdateProductAsync(Product product);
    Task DeleteProductAsync(Guid id);
    Task<bool> ProductExistsAsync(Guid id);
    Task<bool> DecrementStockAsync(Guid productId, int quantity);
}
