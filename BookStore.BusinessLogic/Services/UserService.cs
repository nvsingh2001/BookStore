using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Exceptions;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;
using BookStore.BusinessLogic.Utilities;
using BookStore.DomainModel.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BookStore.BusinessLogic.Services;

public class UserService(
    IUserRepository userRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    IEmailVerificationTokenService emailVerificationTokenService,
    IMapper mapper,
    ITokenBlockList tokenBlockList,
    IPasswordResetTokenService passwordResetTokenService,
    IEmailSender emailSender,
    IConfiguration configuration,
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

        var token = emailVerificationTokenService.GenerateToken(result.UserId, result.Email);
        var link = $"{configuration["AppSettings:BaseUrl"]}/api/user/verify-email?token={token}";
        var body = EmailTemplateLoader.Load("VerificationEmail.html", new Dictionary<string, string>
        {
            ["{{Link}}"] = link
        });
        await emailSender.SendEmailAsync(result.Email, "Verify your email", body);

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
        Guid userId;
        try
        {
            userId = emailVerificationTokenService.ValidateAndExtractUserId(token);
        }
        catch (Exception ex) when (ex is SecurityTokenException or ArgumentException)
        {
            throw new ValidationException("Invalid or expired verification token", ex);
        }

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

    public async Task RequestPasswordResetAsync(string email)
    {
        var user = await userRepository.GetUserByEmailAsync(email);
        if (user is null) return;

        var token = passwordResetTokenService.GenerateToken(user.UserId, user.Email);
        var body = EmailTemplateLoader.Load("PasswordResetEmail.html", new Dictionary<string, string>
        {
            ["{{Code}}"] = token
        });
        await emailSender.SendEmailAsync(user.Email, "Reset your password", body);
    }

    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        Guid userId;
        try
        {
            userId = passwordResetTokenService.ValidateAndExtractUserId(token);
        }
        catch (Exception ex) when (ex is SecurityTokenException or ArgumentException)
        {
            throw new ValidationException("Invalid or expired reset token", ex);
        }


        var user = await userRepository.GetUserByIdAsync(userId);

        if (user is null)
            throw new NotFoundException("User not found");

        user.Password = passwordHasher.Hash(newPassword);

        await userRepository.UpdateUserAsync(user);
    }
}