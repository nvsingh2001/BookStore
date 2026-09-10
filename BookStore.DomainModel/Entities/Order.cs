using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.Entities;

public class Order
{
    [Key]
    public Guid OrderId { get; set; }
    
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(Address))]
    public Guid? AddressId { get; set; }

    [Required]
    public AddressType ShippingAddressType { get; set; }

    [Required]
    [MaxLength(255)]
    public string ShippingFullAddress { get; set; }

    [Required]
    [MaxLength(255)]
    public string ShippingCity { get; set; }

    [Required]
    [MaxLength(255)]
    public string ShippingState { get; set; }

    [Required]
    public OrderStatus Status { get; set; } = OrderStatus.Placed;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; }
    public virtual CustomerAddress Address { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; }
}
