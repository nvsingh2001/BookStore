namespace BookStore.DomainModel.DTOs;

public class AdminAuthResponseDto
{
    public string Token { get; set; }
    public AdminResponseDto Admin { get; set; }
}