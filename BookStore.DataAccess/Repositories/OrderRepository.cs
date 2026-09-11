using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class OrderRepository(ApplicationDbContext dbContext) : IOrderRepository
{
    public async Task<Order> CreateOrderAsync(Order order)
    {
        dbContext.Orders.Add(order);
        await dbContext.SaveChangesAsync();
        return order;
    }

    public async Task<Order?> GetOrderByIdAsync(Guid id)
    {
        return await dbContext.Orders
            .Include(order => order.OrderItems)
            .FirstOrDefaultAsync(order => order.OrderId == id);
    }

    public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId)
    {
        return await dbContext.Orders
            .Include(order => order.OrderItems)
            .Where(order => order.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await dbContext.Orders
            .Include(order => order.OrderItems)
            .ToListAsync();
    }

    public async Task<Order> UpdateOrderStatusAsync(Order order)
    {
        dbContext.Orders.Update(order);
        await dbContext.SaveChangesAsync();
        return order;
    }
}
