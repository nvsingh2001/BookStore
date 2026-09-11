using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<User> UpdateUserAsync(User user);
    Task DeleteUserAsync(Guid id);
    Task<bool> UserExistsAsync(string email);
}