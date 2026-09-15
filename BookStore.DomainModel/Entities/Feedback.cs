using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.DomainModel.Entities;

public class Feedback
{
    [Key]
    public Guid FeedbackId { get; set; }
    
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    
    [Required]
    [MaxLength(512, ErrorMessage = "Comment must be 512 characters or less")]
    public string Comment { get; set; }
    
    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual User User { get; set; }
    public virtual Product Product { get; set; }
}