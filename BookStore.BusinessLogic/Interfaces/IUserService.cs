using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> RegisterUserAsync(UserRegistrationRequestDto userDto);
}