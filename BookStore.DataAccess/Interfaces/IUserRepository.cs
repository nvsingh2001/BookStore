using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<User> UpdateUserAsync(User user);
    Task<bool> UserExistsAsync(string? email, string? phone);
}