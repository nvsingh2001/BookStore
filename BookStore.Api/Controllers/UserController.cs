using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
public class UserController(IUserService userService) : ApiControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<UserResponseDto>>> RegisterUserAsync(
        [FromBody] UserRegistrationRequestDto userRegistrationRequestDto)
    {
        var user = await userService.RegisterUserAsync(userRegistrationRequestDto);
        return Ok(ApiResponse<UserResponseDto>.SuccessResponse(user));
    }


    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> LoginUserAsync(
        [FromBody] UserLoginRequestDto userLoginRequestDto)
    {
        var user = await userService.LoginUserAsync(userLoginRequestDto);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(user));
    }


    [HttpGet("verify-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserResponseDto>>> VerifyEmailAsync([FromQuery] string token)
    {
        var user = await userService.VerifyEmailAsync(token);
        return Ok(ApiResponse<UserResponseDto>.SuccessResponse(user));
    }

    [HttpGet("me")]
    [Authorize(Roles = "User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<UserResponseDto>>> GetMeAsync()
    {
        var userId = CurrentUserId;
        var user = await userService.GetUserByIdAsync(userId);
        return Ok(ApiResponse<UserResponseDto>.SuccessResponse(user));
    }
}