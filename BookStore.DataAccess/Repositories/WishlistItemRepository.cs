using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class WishlistItemRepository(ApplicationDbContext dbContext) : IWishlistItemRepository
{
    public async Task<WishlistItem> AddWishlistItemAsync(WishlistItem wishlistItem)
    {
        dbContext.WishlistItems.Add(wishlistItem);
        await dbContext.SaveChangesAsync();
        return wishlistItem;
    }

    public async Task<WishlistItem?> GetWishlistItemByUserAndProductAsync(Guid userId, Guid productId)
    {
        return await dbContext.WishlistItems.FirstOrDefaultAsync(wishlistItem =>
            wishlistItem.UserId == userId && wishlistItem.ProductId == productId);
    }

    public async Task<IEnumerable<WishlistItem>> GetWishlistItemsByUserIdAsync(Guid userId)
    {
        return await dbContext.WishlistItems.Where(wishlistItem => wishlistItem.UserId == userId).ToListAsync();
    }

    public async Task RemoveWishlistItemAsync(Guid userId, Guid productId)
    {
        var wishlistItem = await dbContext.WishlistItems.FirstOrDefaultAsync(wi =>
            wi.UserId == userId && wi.ProductId == productId);
        if (wishlistItem is null) return;

        dbContext.WishlistItems.Remove(wishlistItem);
        await dbContext.SaveChangesAsync();
    }
}
