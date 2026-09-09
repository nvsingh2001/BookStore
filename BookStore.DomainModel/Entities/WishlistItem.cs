using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.DomainModel.Entities;

public class WishlistItem
{
    [Key]
    public Guid WishlistId { get; set; }
    
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    public virtual User User { get; set; }
    public virtual Product Product { get; set; }
}