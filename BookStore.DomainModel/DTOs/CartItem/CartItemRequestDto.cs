using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class CartItemRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int QuantityToBuy { get; set; } = 1;
}
