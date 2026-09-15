namespace BookStore.DomainModel.DTOs;

public class ProductResponseDto
{
    public string ProductId { get; set; }
    public string BookName { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
    public string? ImageUrl { get; set; }
}