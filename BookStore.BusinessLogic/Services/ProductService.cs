using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.BusinessLogic.Utilities;
using BookStore.DataAccess.Exceptions;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BookStore.BusinessLogic.Services;

public class ProductService(
    IProductRepository productRepository,
    IProductCache productCache,
    IMapper mapper,
    IConfiguration configuration,
    ILogger<ProductService> logger) : IProductService
{
    private const long MaxImageSizeBytes = 5 * 1024 * 1024;

    public async Task<ProductResponseDto> CreateProductAsync(ProductRequestDto productRequestDto, Guid adminId)
    {
        var newProduct = new Product
        {
            BookName = productRequestDto.BookName,
            Author = productRequestDto.Author,
            Description = productRequestDto.Description,
            Price = productRequestDto.Price,
            DiscountPrice = productRequestDto.DiscountPrice,
            Quantity = productRequestDto.Quantity,
            CreatedBy = adminId,
            AddedOn = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow
        };

        var result = await productRepository.CreateProductAsync(newProduct);

        await productCache.InvalidateAllProductsCacheAsync();

        return mapper.Map<ProductResponseDto>(result);
    }

    public async Task<ProductResponseDto> GetProductByIdAsync(Guid productId)
    {
        var cached = await productCache.GetProductAsync(productId);
        if (cached is not null)
            return cached;

        var product = await productRepository.GetProductByIdAsync(productId);

        if (product is null)
            throw new NotFoundException("Product not found");

        var mapped = mapper.Map<ProductResponseDto>(product);
        await productCache.SetProductAsync(productId, mapped);

        return mapped;
    }

    public async Task<List<ProductResponseDto>> GetAllProductsAsync()
    {
        var cached = await productCache.GetProductsAsync();
        if (cached is not null)
            return cached;

        var products = mapper.Map<List<ProductResponseDto>>(await productRepository.GetAllProductsAsync());
        await productCache.SetProductsAsync(products);

        return products;
    }

    public async Task<ProductResponseDto> UpdateProductAsync(Guid productId, ProductRequestDto productRequestDto)
    {
        var product = await productRepository.GetProductByIdAsync(productId);

        if (product is null)
            throw new NotFoundException("Product not found");

        product.BookName = productRequestDto.BookName;
        product.Author = productRequestDto.Author;
        product.Description = productRequestDto.Description;
        product.Price = productRequestDto.Price;
        product.DiscountPrice = productRequestDto.DiscountPrice;
        product.Quantity = productRequestDto.Quantity;
        product.LastModifiedDate = DateTime.UtcNow;

        var result = await productRepository.UpdateProductAsync(product);

        await productCache.InvalidateProductCacheAsync(productId);
        await productCache.InvalidateAllProductsCacheAsync();

        return mapper.Map<ProductResponseDto>(result);
    }

    public async Task DeleteProductAsync(Guid productId)
    {
        var productExists = await productRepository.ProductExistsAsync(productId);

        if (!productExists)
            throw new NotFoundException("Product not found");

        try
        {
            await productRepository.DeleteProductAsync(productId);
        }
        catch (ForeignKeyConstraintException ex)
        {
            throw new ConflictException("Product cannot be deleted", ex);
        }

        try
        {
            ProductImageStorage.DeleteImage(productId);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to delete image for product {ProductId}", productId);
        }

        await productCache.InvalidateProductCacheAsync(productId);
        await productCache.InvalidateAllProductsCacheAsync();
    }

    public async Task<ProductResponseDto> UploadProductImageAsync(Guid productId, Stream imageStream,
        string contentType, long contentLength)
    {
        var product = await productRepository.GetProductByIdAsync(productId);

        if (product is null)
            throw new NotFoundException("Product not found");

        if (!ProductImageStorage.ExtensionsByContentType.ContainsKey(contentType))
            throw new ValidationException("Image must be JPEG, PNG, or WebP");

        if (contentLength > MaxImageSizeBytes)
            throw new ValidationException("Image must be 5MB or smaller");

        var baseUrl = configuration["AppSettings:BaseUrl"];
        product.ImageUrl = await ProductImageStorage.SaveImageAsync(productId, imageStream, contentType, baseUrl!);
        product.LastModifiedDate = DateTime.UtcNow;

        var result = await productRepository.UpdateProductAsync(product);

        await productCache.InvalidateProductCacheAsync(productId);
        await productCache.InvalidateAllProductsCacheAsync();

        return mapper.Map<ProductResponseDto>(result);
    }
}