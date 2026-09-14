using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Exceptions;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;
using BookStore.DomainModel.Enums;

namespace BookStore.BusinessLogic.Services;

public class UserService(
    IUserRepository userRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    IEmailVerificationTokenService emailVerificationTokenService,
    IMapper mapper,
    ITokenBlockList tokenBlockList,
    IPasswordHasher passwordHasher) : IUserService
{
    public async Task<UserResponseDto> RegisterUserAsync(UserRegistrationRequestDto userDto)
    {
        var userExists = await userRepository.UserExistsAsync(userDto.Email, userDto.Phone);

        if (userExists)
            throw new ConflictException("Email or Phone already linked to another account");

        var hashedPassword = passwordHasher.Hash(userDto.Password);

        var newUser = new User
        {
            Fullname = userDto.FullName,
            Email = userDto.Email,
            Phone = userDto.Phone,
            Password = hashedPassword
        };

        User result;
        try
        {
            result = await userRepository.CreateUserAsync(newUser);
        }
        catch (DuplicateKeyException ex)
        {
            throw new ConflictException("Email or Phone already linked to another account", ex);
        }

        return mapper.Map<UserResponseDto>(result);
    }

    public async Task<AuthResponseDto> LoginUserAsync(UserLoginRequestDto userDto)
    {
        var user = await userRepository.GetUserByEmailAsync(userDto.Email);

        if (user is null)
            throw new NotFoundException($"User with email: {userDto.Email} does not exist");

        if (!passwordHasher.Verify(userDto.Password, user.Password))
            throw new ValidationException("Invalid Password");

        var jwtToken = jwtTokenGenerator.GenerateToken(user.UserId, user.Email, UserRole.User);

        return new AuthResponseDto
        {
            Token = jwtToken,
            User = mapper.Map<UserResponseDto>(user)
        };
    }

    public async Task<UserResponseDto> VerifyEmailAsync(string token)
    {
        var userId = emailVerificationTokenService.ValidateAndExtractUserId(token);

        var user = await userRepository.GetUserByIdAsync(userId);

        if (user is null)
            throw new NotFoundException("User not found");

        user.IsVerified = true;
        var result = await userRepository.UpdateUserAsync(user);

        return mapper.Map<UserResponseDto>(result);
    }

    public async Task<UserResponseDto> GetUserByIdAsync(Guid userId)
    {
        var user = await userRepository.GetUserByIdAsync(userId);

        return user is null ? throw new NotFoundException("User not found") : mapper.Map<UserResponseDto>(user);
    }

    public async Task LogoutUserAsync(string jti, TimeSpan remainingLifetime)
    {
        if (remainingLifetime <= TimeSpan.Zero) return;
        await tokenBlockList.BlockTokenAsync(jti, remainingLifetime);
    }
}