using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.DomainModel.Entities;

public class Product
{
    [Key] public Guid ProductId { get; set; }

    [Required]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    public string BookName { get; set; }

    [Required]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    public string Author { get; set; }

    [Required]
    [MaxLength(512, ErrorMessage = "Max length is 512")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    public string Description { get; set; }

    [Required] public int Quantity { get; set; }

    [Column(TypeName = "decimal(10,2)")] public decimal Price { get; set; }

    [Column(TypeName = "decimal(10,2)")] public decimal DiscountPrice { get; set; }

    public DateTime AddedOn { get; set; }
    public DateTime LastModifiedDate { get; set; }

    [ForeignKey(nameof(Admin))] public Guid CreatedBy { get; set; }


    public virtual Admin Admin { get; set; }
    public ICollection<Feedback> Feedbacks { get; set; }
    public ICollection<CartItem> CartItems { get; set; }
    public ICollection<WishlistItem> WishlistItems { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}