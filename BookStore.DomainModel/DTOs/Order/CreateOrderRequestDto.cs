using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class CreateOrderRequestDto
{
    public string? AddressId { get; set; }

    [Required(ErrorMessage = "Order must contain at least one item")]
    [MinLength(1, ErrorMessage = "Order must contain at least one item")]
    public List<OrderItemRequestDto> Orders { get; set; }
}
