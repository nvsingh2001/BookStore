using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Exceptions;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class ProductService(IProductRepository productRepository, IProductCache productCache, IMapper mapper)
    : IProductService
{
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

        await productCache.InvalidateProductCacheAsync(productId);
        await productCache.InvalidateAllProductsCacheAsync();
    }
}