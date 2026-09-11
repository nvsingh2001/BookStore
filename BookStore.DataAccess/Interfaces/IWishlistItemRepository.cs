using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IWishlistItemRepository
{
    Task<WishlistItem> AddWishlistItemAsync(WishlistItem wishlistItem);
    Task<WishlistItem?> GetWishlistItemByUserAndProductAsync(Guid userId, Guid productId);
    Task<IEnumerable<WishlistItem>> GetWishlistItemsByUserIdAsync(Guid userId);
    Task RemoveWishlistItemAsync(Guid userId, Guid productId);
}
