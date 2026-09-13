using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class CartItemController(ICartItemService cartItemService) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<List<CartItemResponseDto>>>> GetCartAsync()
    {
        var cartItems = await cartItemService.GetCartAsync(CurrentUserId);
        return Ok(ApiResponse<List<CartItemResponseDto>>.SuccessResponse(cartItems));
    }


    [HttpPost("{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> AddToCartAsync(Guid productId,
        [FromBody] CartItemRequestDto cartItemRequestDto)
    {
        var cartItem = await cartItemService.AddToCartAsync(CurrentUserId, productId, cartItemRequestDto);
        return Ok(ApiResponse<CartItemResponseDto>.SuccessResponse(cartItem));
    }


    [HttpPut("{cartItemId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> UpdateQuantityAsync(Guid cartItemId,
        [FromBody] CartItemRequestDto cartItemRequestDto)
    {
        var cartItem = await cartItemService.UpdateQuantityAsync(CurrentUserId, cartItemId, cartItemRequestDto);
        return Ok(ApiResponse<CartItemResponseDto>.SuccessResponse(cartItem));
    }


    [HttpDelete("{cartItemId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> RemoveFromCartAsync(Guid cartItemId)
    {
        await cartItemService.RemoveFromCartAsync(CurrentUserId, cartItemId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Cart item removed successfully"));
    }
}
