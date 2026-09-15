using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface ICartItemRepository
{
    Task<CartItem> AddCartItemAsync(CartItem cartItem);
    Task<CartItem?> GetCartItemByIdAsync(Guid cartItemId);
    Task<CartItem?> GetCartItemByUserAndProductAsync(Guid userId, Guid productId);
    Task<IEnumerable<CartItem>> GetCartItemsByUserIdAsync(Guid userId);
    Task<CartItem> UpdateCartItemAsync(CartItem cartItem);
    Task RemoveCartItemAsync(Guid cartItemId);
}
