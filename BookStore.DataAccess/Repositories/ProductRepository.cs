using BookStore.DataAccess.Exceptions;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
{
    private const int ForeignKeyViolation = 547;

    public async Task<Product> CreateProductAsync(Product product)
    {
        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> GetProductByIdAsync(Guid id)
    {
        return await dbContext.Products.FirstOrDefaultAsync(product => product.ProductId == id);
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
        var product = await dbContext.Products.FirstOrDefaultAsync(p => p.ProductId == id);
        if (product is null) return;

        dbContext.Products.Remove(product);

        try
        {
            await dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: ForeignKeyViolation })
        {
            throw new ForeignKeyConstraintException("Product cannot be deleted because it has existing orders", ex);
        }
    }

    public async Task<bool> ProductExistsAsync(Guid id)
    {
        return await dbContext.Products.AnyAsync(product => product.ProductId == id);
    }

    public async Task<bool> DecrementStockAsync(Guid productId, int quantity)
    {
        var rowsAffected = await dbContext.Products
            .Where(product => product.ProductId == productId && product.Quantity >= quantity)
            .ExecuteUpdateAsync(setters => setters.SetProperty(
                product => product.Quantity,
                product => product.Quantity - quantity));

        return rowsAffected > 0;
    }
}