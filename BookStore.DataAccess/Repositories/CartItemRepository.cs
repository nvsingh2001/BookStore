using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class CartItemRepository(ApplicationDbContext dbContext) : ICartItemRepository
{
    public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
    {
        dbContext.CartItems.Add(cartItem);
        await dbContext.SaveChangesAsync();
        return cartItem;
    }

    public async Task<CartItem?> GetCartItemByIdAsync(Guid cartItemId)
    {
        return await dbContext.CartItems.FirstOrDefaultAsync(cartItem => cartItem.CartItemId == cartItemId);
    }

    public async Task<CartItem?> GetCartItemByUserAndProductAsync(Guid userId, Guid productId)
    {
        return await dbContext.CartItems.FirstOrDefaultAsync(cartItem =>
            cartItem.UserId == userId && cartItem.ProductId == productId);
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsByUserIdAsync(Guid userId)
    {
        return await dbContext.CartItems.Where(cartItem => cartItem.UserId == userId).ToListAsync();
    }

    public async Task<CartItem> UpdateCartItemAsync(CartItem cartItem)
    {
        dbContext.CartItems.Update(cartItem);
        await dbContext.SaveChangesAsync();
        return cartItem;
    }

    public async Task RemoveCartItemAsync(Guid cartItemId)
    {
        var cartItem = await dbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);
        if (cartItem is null) return;

        dbContext.CartItems.Remove(cartItem);
        await dbContext.SaveChangesAsync();
    }
}
