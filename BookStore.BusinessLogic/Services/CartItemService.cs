using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class CartItemService(
    ICartItemRepository cartItemRepository,
    IProductRepository productRepository,
    IMapper mapper) : ICartItemService
{
    public async Task<CartItemResponseDto> AddToCartAsync(Guid userId, Guid productId, CartItemRequestDto dto)
    {
        var product = await productRepository.GetProductByIdAsync(productId);

        if (product is null)
            throw new NotFoundException("Product not found");

        var existing = await cartItemRepository.GetCartItemByUserAndProductAsync(userId, productId);

        CartItem result;
        if (existing is not null)
        {
            existing.QuantityToBuy += dto.QuantityToBuy;
            result = await cartItemRepository.UpdateCartItemAsync(existing);
        }
        else
        {
            var newCartItem = new CartItem
            {
                UserId = userId,
                ProductId = productId,
                QuantityToBuy = dto.QuantityToBuy
            };

            result = await cartItemRepository.AddCartItemAsync(newCartItem);
        }

        result.Product = product;
        return mapper.Map<CartItemResponseDto>(result);
    }

    public async Task<CartItemResponseDto> UpdateQuantityAsync(Guid userId, Guid cartItemId, CartItemRequestDto dto)
    {
        var cartItem = await cartItemRepository.GetCartItemByIdAsync(cartItemId);

        if (cartItem is null)
            throw new NotFoundException("Cart item not found");

        if (cartItem.UserId != userId)
            throw new ForbiddenException("You do not have access to this cart item");

        cartItem.QuantityToBuy = dto.QuantityToBuy;
        var result = await cartItemRepository.UpdateCartItemAsync(cartItem);

        return mapper.Map<CartItemResponseDto>(result);
    }

    public async Task RemoveFromCartAsync(Guid userId, Guid cartItemId)
    {
        var cartItem = await cartItemRepository.GetCartItemByIdAsync(cartItemId);

        if (cartItem is null)
            throw new NotFoundException("Cart item not found");

        if (cartItem.UserId != userId)
            throw new ForbiddenException("You do not have access to this cart item");

        await cartItemRepository.RemoveCartItemAsync(cartItemId);
    }

    public async Task<List<CartItemResponseDto>> GetCartAsync(Guid userId)
    {
        var cartItems = await cartItemRepository.GetCartItemsByUserIdAsync(userId);
        return mapper.Map<List<CartItemResponseDto>>(cartItems);
    }
}
