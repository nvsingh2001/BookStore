using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
public class AdminController(IAdminService adminService) : ApiControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<AdminResponseDto>>> RegisterAdminAsync(
        [FromBody] AdminRegistrationRequestDto adminRegistrationRequestDto)
    {
        var admin = await adminService.CreateAdminAsync(adminRegistrationRequestDto);
        return Ok(ApiResponse<AdminResponseDto>.SuccessResponse(admin));
    }


    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<AdminAuthResponseDto>>> LoginAdminAsync(
        [FromBody] AdminLoginRequestDto adminLoginRequestDto)
    {
        var admin = await adminService.LoginAdminAsync(adminLoginRequestDto);
        return Ok(ApiResponse<AdminAuthResponseDto>.SuccessResponse(admin));
    }
}