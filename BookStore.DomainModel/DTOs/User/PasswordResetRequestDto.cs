using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class PasswordResetRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    [MaxLength(255, ErrorMessage = "Max length is 255")]
    public string Email { get; set; }
}
