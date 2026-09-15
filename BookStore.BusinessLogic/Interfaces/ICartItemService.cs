using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface ICartItemService
{
    Task<CartItemResponseDto> AddToCartAsync(Guid userId, Guid productId, CartItemRequestDto dto);
    Task<CartItemResponseDto> UpdateQuantityAsync(Guid userId, Guid cartItemId, CartItemRequestDto dto);
    Task RemoveFromCartAsync(Guid userId, Guid cartItemId);
    Task<List<CartItemResponseDto>> GetCartAsync(Guid userId);
}
