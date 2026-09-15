using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto createOrderRequestDto, Guid userId, string userEmail);
    Task<OrderResponseDto> GetOrderByIdAsync(Guid orderId, Guid userId);
    Task<List<OrderResponseDto>> GetOrdersByUserAsync(Guid userId);
    Task<List<OrderResponseDto>> GetAllOrdersAsync();
}