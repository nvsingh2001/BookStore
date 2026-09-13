using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
public class ProductController(IProductService productService) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetAllProductsAsync()
    {
        var products = await productService.GetAllProductsAsync();
        return Ok(ApiResponse<List<ProductResponseDto>>.SuccessResponse(products));
    }


    [HttpGet("{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProductByIdAsync(Guid productId)
    {
        var product = await productService.GetProductByIdAsync(productId);
        return Ok(ApiResponse<ProductResponseDto>.SuccessResponse(product));
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> CreateProductAsync(
        [FromBody] ProductRequestDto productRequestDto)
    {
        var product = await productService.CreateProductAsync(productRequestDto, CurrentUserId);
        return Ok(ApiResponse<ProductResponseDto>.SuccessResponse(product));
    }


    [HttpPut("{productId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> UpdateProductAsync(Guid productId,
        [FromBody] ProductRequestDto productRequestDto)
    {
        var product = await productService.UpdateProductAsync(productId, productRequestDto);
        return Ok(ApiResponse<ProductResponseDto>.SuccessResponse(product));
    }


    [HttpDelete("{productId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProductAsync(Guid productId)
    {
        await productService.DeleteProductAsync(productId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Product deleted successfully"));
    }
}
