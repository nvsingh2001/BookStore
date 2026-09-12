using BookStore.DomainModel.DTOs;

namespace BookStore.BusinessLogic.Interfaces;

public interface IFeedbackService
{
    Task<FeedbackResponseDto> AddFeedbackAsync(Guid userId, Guid productId, FeedbackRequestDto dto);
    Task<List<FeedbackResponseDto>> GetFeedbackByProductIdAsync(Guid productId);
}
