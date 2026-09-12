using System.ComponentModel.DataAnnotations;
using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.DTOs;

public class CustomerAddressRequestDto
{
    [Required(ErrorMessage = "AddressType is required")]
    public AddressType AddressType { get; set; }

    [Required(ErrorMessage = "Address is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string FullAddress { get; set; }

    [Required(ErrorMessage = "City is required")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string City { get; set; }

    [Required(ErrorMessage = "State is required")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string State { get; set; }

    public bool IsDefault { get; set; }
}
