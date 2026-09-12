using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class ProductRequestDto
{
    [Required(ErrorMessage = "Book name is required")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    public string BookName { get; set; }

    [Required(ErrorMessage = "Author is required")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    public string Author { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    [MaxLength(512, ErrorMessage = "Max length is 512")]
    public string Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")]
    public int Quantity { get; set; }

    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Range(0, (double)decimal.MaxValue, ErrorMessage = "Discount price cannot be negative")]
    public decimal DiscountPrice { get; set; }
}
