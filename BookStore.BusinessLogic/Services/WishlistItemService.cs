using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class WishlistItemService(
    IWishlistItemRepository wishlistItemRepository,
    IProductRepository productRepository,
    IMapper mapper) : IWishlistItemService
{
    public async Task<WishlistItemResponseDto> AddToWishlistAsync(Guid userId, Guid productId)
    {
        var product = await productRepository.GetProductByIdAsync(productId);

        if (product is null)
            throw new NotFoundException("Product not found");

        var existing = await wishlistItemRepository.GetWishlistItemByUserAndProductAsync(userId, productId);

        if (existing is not null)
        {
            existing.Product = product;
            return mapper.Map<WishlistItemResponseDto>(existing);
        }

        var newWishlistItem = new WishlistItem
        {
            UserId = userId,
            ProductId = productId
        };

        var result = await wishlistItemRepository.AddWishlistItemAsync(newWishlistItem);
        result.Product = product;

        return mapper.Map<WishlistItemResponseDto>(result);
    }

    public async Task RemoveFromWishlistAsync(Guid userId, Guid productId)
    {
        var existing = await wishlistItemRepository.GetWishlistItemByUserAndProductAsync(userId, productId);

        if (existing is null)
            throw new NotFoundException("Wishlist item not found");

        await wishlistItemRepository.RemoveWishlistItemAsync(userId, productId);
    }

    public async Task<List<WishlistItemResponseDto>> GetWishlistAsync(Guid userId)
    {
        var wishlistItems = await wishlistItemRepository.GetWishlistItemsByUserIdAsync(userId);
        return mapper.Map<List<WishlistItemResponseDto>>(wishlistItems);
    }
}
