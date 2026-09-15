using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class FeedbackRepository(ApplicationDbContext dbContext) : IFeedbackRepository
{
    public async Task<Feedback> AddFeedbackAsync(Feedback feedback)
    {
        dbContext.Feedbacks.Add(feedback);
        await dbContext.SaveChangesAsync();
        return feedback;
    }

    public async Task<Feedback?> GetFeedbackByUserAndProductAsync(Guid userId, Guid productId)
    {
        return await dbContext.Feedbacks.Include(feedback => feedback.User).FirstOrDefaultAsync(feedback =>
            feedback.UserId == userId && feedback.ProductId == productId);
    }

    public async Task<IEnumerable<Feedback>> GetFeedbacksByProductIdAsync(Guid productId)
    {
        return await dbContext.Feedbacks.Include(feedback => feedback.User)
            .Where(feedback => feedback.ProductId == productId).ToListAsync();
    }
}
