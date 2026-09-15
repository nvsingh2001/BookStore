namespace BookStore.DomainModel.DTOs;

public class CartItemResponseDto
{
    public string CartItemId { get; set; }
    public int QuantityToBuy { get; set; }
    public ProductResponseDto Product { get; set; }   
}