using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> RegisterUserAsync(UserRegistrationRequestDto userDto);
    Task<AuthResponseDto> LoginUserAsync(UserLoginRequestDto userDto);
    Task<UserResponseDto> VerifyEmailAsync(string token);
    Task<UserResponseDto> GetUserByIdAsync(Guid userId);
    Task LogoutUserAsync(string jti, TimeSpan remainingLifetime);
    Task RequestPasswordResetAsync(string email);
    Task ResetPasswordAsync(string token, string newPassword);
}