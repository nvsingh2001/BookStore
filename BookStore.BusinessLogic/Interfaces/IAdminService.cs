using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IAdminService
{
    Task<AdminResponseDto> CreateAdminAsync(AdminRegistrationRequestDto dto);
    Task<AdminAuthResponseDto> LoginAdminAsync(AdminLoginRequestDto dto);
}