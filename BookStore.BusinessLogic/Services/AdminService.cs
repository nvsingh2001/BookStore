using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;
using BookStore.DomainModel.Enums;

namespace BookStore.BusinessLogic.Services;

public class AdminService(
    IAdminRepository adminRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    IMapper mapper,
    IPasswordHasher passwordHasher) : IAdminService
{
    public async Task<AdminResponseDto> CreateAdminAsync(AdminRegistrationRequestDto dto)
    {
        var adminExists = await adminRepository.AdminExistsAsync(dto.Email, dto.Phone);

        if (adminExists)
            throw new ConflictException("Email or Phone already linked another account");

        var hashedPassowrd = passwordHasher.Hash(dto.Password);

        var newAdmin = new Admin
        {
            Fullname = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Password = hashedPassowrd
        };

        var result = await adminRepository.CreateAdminAsync(newAdmin);

        return mapper.Map<AdminResponseDto>(result);
    }

    public async Task<AdminAuthResponseDto> LoginAdminAsync(AdminLoginRequestDto dto)
    {
        var admin = await adminRepository.GetAdminByEmailAsync(dto.Email);

        if (admin is null)
            throw new NotFoundException($"Admin with email: {dto.Email} does not exists");

        if (!passwordHasher.Verify(dto.Password, admin.Password))
            throw new ValidationException("Invalid Password");

        var jwtToken = jwtTokenGenerator.GenerateToken(admin.AdminId, admin.Email, UserRole.Admin);

        return new AdminAuthResponseDto
        {
            Token = jwtToken,
            Admin = mapper.Map<AdminResponseDto>(admin)
        };
    }
}