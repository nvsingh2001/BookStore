using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class FeedbackService(
    IFeedbackRepository feedbackRepository,
    IProductRepository productRepository,
    IMapper mapper) : IFeedbackService
{
    public async Task<FeedbackResponseDto> AddFeedbackAsync(Guid userId, Guid productId, FeedbackRequestDto dto)
    {
        var productExists = await productRepository.ProductExistsAsync(productId);

        if (!productExists)
            throw new NotFoundException("Product not found");

        var existing = await feedbackRepository.GetFeedbackByUserAndProductAsync(userId, productId);

        if (existing is not null)
            throw new ConflictException("You have already reviewed this product");

        var newFeedback = new Feedback
        {
            UserId = userId,
            ProductId = productId,
            Comment = dto.Comment,
            Rating = dto.Rating
        };

        await feedbackRepository.AddFeedbackAsync(newFeedback);

        var savedFeedback = await feedbackRepository.GetFeedbackByUserAndProductAsync(userId, productId);

        return mapper.Map<FeedbackResponseDto>(savedFeedback);
    }

    public async Task<List<FeedbackResponseDto>> GetFeedbackByProductIdAsync(Guid productId)
    {
        var feedbacks = await feedbackRepository.GetFeedbacksByProductIdAsync(productId);
        return mapper.Map<List<FeedbackResponseDto>>(feedbacks);
    }
}
