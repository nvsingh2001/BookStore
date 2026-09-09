using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.DomainModel.Entities;

public class CartItem
{
    [Key] 
    public Guid CartItemId { get; set; }

    [ForeignKey(nameof(User))] 
    public Guid UserId { get; set; }

    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    
    [Range(1, int.MaxValue)] 
    public int QuantityToBuy { get; set; } = 1;
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; }
    public virtual Product Product { get; set; }
}