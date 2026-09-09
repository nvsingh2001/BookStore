namespace BookStore.DomainModel.DTOs;

public class ProductRequestDto
{
    public string BookName { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
}