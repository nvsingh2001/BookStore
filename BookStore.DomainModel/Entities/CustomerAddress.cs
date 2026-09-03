using System.ComponentModel.DataAnnotations;
using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.Entities;

public class CustomerAddress
{
    [Key]
    public Guid CustomerAddressId { get; set; }
    
    [Required(ErrorMessage = "Userid is required")]
    public int Userid { get; set; }
    
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
    
}