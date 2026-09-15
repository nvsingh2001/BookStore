using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.Entities;

public class Admin
{
    [Key]
    public Guid AdminId { get; set; }
    
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
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string Password { get; set; }
    
    [Required(ErrorMessage = "Phone Number is required")]
    [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone Number should be of 10-Digit")]
    public string Phone { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Product> Products { get; set; }
}