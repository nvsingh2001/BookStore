using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IFeedbackRepository
{
    Task<Feedback> AddFeedbackAsync(Feedback feedback);
    Task<Feedback?> GetFeedbackByUserAndProductAsync(Guid userId, Guid productId);
    Task<IEnumerable<Feedback>> GetFeedbacksByProductIdAsync(Guid productId);
}
