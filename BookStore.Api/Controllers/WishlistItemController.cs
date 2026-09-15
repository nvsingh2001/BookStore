using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class WishlistItemController(IWishlistItemService wishlistItemService) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<List<WishlistItemResponseDto>>>> GetWishlistAsync()
    {
        var wishlistItems = await wishlistItemService.GetWishlistAsync(CurrentUserId);
        return Ok(ApiResponse<List<WishlistItemResponseDto>>.SuccessResponse(wishlistItems));
    }


    [HttpPost("{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WishlistItemResponseDto>>> AddToWishlistAsync(Guid productId)
    {
        var wishlistItem = await wishlistItemService.AddToWishlistAsync(CurrentUserId, productId);
        return Ok(ApiResponse<WishlistItemResponseDto>.SuccessResponse(wishlistItem));
    }


    [HttpDelete("{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> RemoveFromWishlistAsync(Guid productId)
    {
        await wishlistItemService.RemoveFromWishlistAsync(CurrentUserId, productId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Wishlist item removed successfully"));
    }
}
