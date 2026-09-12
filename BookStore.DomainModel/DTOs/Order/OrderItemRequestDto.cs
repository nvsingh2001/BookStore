using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class OrderItemRequestDto
{
    [Required(ErrorMessage = "ProductId is required")]
    public string ProductId { get; set; }

    public string ProductName { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int ProductQuantity { get; set; }

    public decimal ProductPrice { get; set; }
}
