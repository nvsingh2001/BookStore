using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class UserLoginRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    public string Password { get; set; }
}
