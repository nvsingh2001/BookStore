using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class PasswordResetDto
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Min length is 6")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string NewPassword { get; set; }
}
