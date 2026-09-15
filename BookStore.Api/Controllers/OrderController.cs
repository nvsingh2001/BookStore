using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
public class OrderController(IOrderService orderService) : ApiControllerBase
{
    [HttpPost]
    [Authorize(Roles = "User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> CreateOrderAsync(
        [FromBody] CreateOrderRequestDto createOrderRequestDto)
    {
        var order = await orderService.CreateOrderAsync(createOrderRequestDto, CurrentUserId, CurrentUserEmail);
        return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(order));
    }


    [HttpGet("{orderId:guid}")]
    [Authorize(Roles = "User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrderByIdAsync(Guid orderId)
    {
        var order = await orderService.GetOrderByIdAsync(orderId, CurrentUserId);
        return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(order));
    }


    [HttpGet]
    [Authorize(Roles = "User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetOrdersByUserAsync()
    {
        var orders = await orderService.GetOrdersByUserAsync(CurrentUserId);
        return Ok(ApiResponse<List<OrderResponseDto>>.SuccessResponse(orders));
    }


    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetAllOrdersAsync()
    {
        var orders = await orderService.GetAllOrdersAsync();
        return Ok(ApiResponse<List<OrderResponseDto>>.SuccessResponse(orders));
    }
}
