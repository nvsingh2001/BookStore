using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class CustomerAddressController(ICustomerAddressService customerAddressService) : ApiControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<CustomerAddressResponseDto>>> UpsertDefaultAddressAsync(
        [FromBody] CustomerAddressRequestDto customerAddressRequestDto)
    {
        var address = await customerAddressService.UpsertDefaultAddressAsync(CurrentUserId, customerAddressRequestDto);
        return Ok(ApiResponse<CustomerAddressResponseDto>.SuccessResponse(address));
    }
}
