using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class OrderService(
    IOrderRepository orderRepository,
    IProductRepository productRepository,
    ICustomerAddressService customerAddressService,
    IUnitOfWork unitOfWork,
    IMapper mapper) : IOrderService
{
    public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto createOrderRequestDto, Guid userId)
    {
        if (createOrderRequestDto.Orders is null || createOrderRequestDto.Orders.Count == 0)
            throw new ValidationException("Order must contain at least one item");

        var address = createOrderRequestDto.AddressId is not null
            ? await customerAddressService.GetAddressByIdAsync(userId, Guid.Parse(createOrderRequestDto.AddressId))
            : await customerAddressService.GetDefaultAddressAsync(userId);

        var orderLines = new List<(Product Product, int Quantity)>();

        foreach (var item in createOrderRequestDto.Orders)
        {
            var product = await productRepository.GetProductByIdAsync(Guid.Parse(item.ProductId));

            if (product is null)
                throw new NotFoundException($"Product {item.ProductId} not found");

            if (product.Quantity < item.ProductQuantity)
                throw new ConflictException($"Insufficient stock for {product.BookName}");

            orderLines.Add((product, item.ProductQuantity));
        }

        var order = await unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var newOrder = new Order
            {
                UserId = userId,
                AddressId = address.AddressId,
                ShippingAddressType = address.AddressType,
                ShippingFullAddress = address.FullAddress,
                ShippingCity = address.City,
                ShippingState = address.State,
                OrderItems = orderLines.Select(line => new OrderItem
                {
                    ProductId = line.Product.ProductId,
                    ProductName = line.Product.BookName,
                    ProductQuantity = line.Quantity,
                    ProductPrice = line.Product.DiscountPrice > 0 ? line.Product.DiscountPrice : line.Product.Price
                }).ToList()
            };

            var createdOrder = await orderRepository.CreateOrderAsync(newOrder);

            foreach (var (product, quantity) in orderLines)
            {
                var decremented = await productRepository.DecrementStockAsync(product.ProductId, quantity);

                if (!decremented)
                    throw new ConflictException($"Insufficient stock for {product.BookName}");
            }

            return createdOrder;
        });

        return mapper.Map<OrderResponseDto>(order);
    }

    public async Task<OrderResponseDto> GetOrderByIdAsync(Guid orderId, Guid userId)
    {
        var order = await orderRepository.GetOrderByIdAsync(orderId);

        if (order is null)
            throw new NotFoundException("Order not found");

        if (order.UserId != userId)
            throw new ForbiddenException("You do not have access to this order");

        return mapper.Map<OrderResponseDto>(order);
    }

    public async Task<List<OrderResponseDto>> GetOrdersByUserAsync(Guid userId)
    {
        var orders = await orderRepository.GetOrdersByUserIdAsync(userId);
        return mapper.Map<List<OrderResponseDto>>(orders);
    }

    public async Task<List<OrderResponseDto>> GetAllOrdersAsync()
    {
        var orders = await orderRepository.GetAllOrdersAsync();
        return mapper.Map<List<OrderResponseDto>>(orders);
    }
}
