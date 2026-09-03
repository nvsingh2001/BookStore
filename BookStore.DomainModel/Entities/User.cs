using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.Entities;

public class User
{
    [Key]
    public Guid Userid { get; set; }
    
    [Required(ErrorMessage = "Full name is required")]
    [MaxLength(100, ErrorMessage = "Max length is 100")]
    [MinLength(3, ErrorMessage = "Min length is 3")]
    public string Fullname { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    public string Password { get; set; }
    
    public ICollection<CustomerAddress>  CustomerAddresses { get; set; }
}