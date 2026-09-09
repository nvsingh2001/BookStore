namespace BookStore.DomainModel.DTOs;

public class CreateOrderRequestDto
{
    public List<OrderItemRequestDto> Orders { get; set; }
}