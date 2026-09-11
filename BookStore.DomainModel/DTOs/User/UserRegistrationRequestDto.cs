namespace BookStore.DomainModel.DTOs;

public class UserRegistrationRequestDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
}