namespace BookStore.DomainModel.DTOs;

public class WishlistItemResponseDto
{
    public string WishlistItemId { get; set; }
    public ProductResponseDto Product { get; set; }
}