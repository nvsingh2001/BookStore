namespace BookStore.DomainModel.DTOs;

public class AdminRegistrationRequestDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
}