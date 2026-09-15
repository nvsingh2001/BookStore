using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.DomainModel.Entities;

public class OrderItem
{
    [Key]
    public Guid OrderItemId { get; set; }
    
    [ForeignKey(nameof(Order))]
    public Guid OrderId { get; set; }
    
    [ForeignKey(nameof(Product))]
    public Guid ProductId { get; set; }
    
    [Required]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    [MinLength(2, ErrorMessage = "Min length is 2")]
    public string ProductName { get; set; }

    public int ProductQuantity { get; set; } = 1;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal ProductPrice { get; set; }
    
    public virtual Order Order { get; set; }
    public virtual Product Product { get; set; }
}