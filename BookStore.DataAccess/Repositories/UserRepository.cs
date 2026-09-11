using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class UserRepository(ApplicationDbContext dbContext) : IUserRepository
{
    public async Task<User> CreateUserAsync(User user)
    {
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        var query = dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();
        return query.Entity;
    }

    public async Task<bool> UserExistsAsync(string? email, string? phone)
    {
        return await dbContext.Users.AnyAsync(user => user.Email == email || user.Phone == phone);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await dbContext.Users.FirstOrDefaultAsync(user => user.UserId == userId);
    }
}