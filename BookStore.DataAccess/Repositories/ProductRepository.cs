using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
{
    public async Task<Product> CreateProductAsync(Product product)
    {
        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> GetProductByIdAsync(Guid id)
    {
        return await dbContext.Products.FirstOrDefaultAsync(product => product.BookId == id);
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await dbContext.Products.ToListAsync();
    }

    public async Task<Product> UpdateProductAsync(Product product)
    {
        dbContext.Products.Update(product);
        await dbContext.SaveChangesAsync();
        return product;
    }

    public async Task DeleteProductAsync(Guid id)
    {
        var product = await dbContext.Products.FirstOrDefaultAsync(p => p.BookId == id);
        if (product is null) return;

        dbContext.Products.Remove(product);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> ProductExistsAsync(Guid id)
    {
        return await dbContext.Products.AnyAsync(product => product.BookId == id);
    }
}
