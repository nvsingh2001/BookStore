using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.Entities;

public class CustomerAddress
{
    [Key] public Guid AddressId { get; set; }

    [Required(ErrorMessage = "UserId is required")]
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }

    [Required(ErrorMessage = "AddressType is required")]
    public AddressType AddressType { get; set; }

    [Required(ErrorMessage = "Address is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string Fulladdress { get; set; }

    [Required(ErrorMessage = "City is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string City { get; set; }

    [Required(ErrorMessage = "State is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string State { get; set; }

    public virtual User User { get; set; }
    public ICollection<Order> Orders { get; set; }
}