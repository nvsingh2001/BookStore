using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.DTOs;

public class OrderResponseDto
{
    public string OrderId { get; set; }
    public string UserId { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public CustomerAddressResponseDto ShippingAddress { get; set; }
    public List<OrderItemResponseDto> Items { get; set; }
}