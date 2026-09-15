using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IWishlistItemService
{
    Task<WishlistItemResponseDto> AddToWishlistAsync(Guid userId, Guid productId);
    Task RemoveFromWishlistAsync(Guid userId, Guid productId);
    Task<List<WishlistItemResponseDto>> GetWishlistAsync(Guid userId);
}
