using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
    Task<Order?> GetOrderByIdAsync(Guid id);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<Order> UpdateOrderStatusAsync(Order order);
}
