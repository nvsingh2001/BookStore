using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class AdminRepository(ApplicationDbContext dbContext) : IAdminRepository
{
    public async Task<Admin> CreateAdminAsync(Admin admin)
    {
        dbContext.Admins.Add(admin);
        await dbContext.SaveChangesAsync();
        return admin;
    }

    public async Task<Admin> UpdateAdminAsync(Admin admin)
    {
        dbContext.Admins.Update(admin);
        await dbContext.SaveChangesAsync();
        return admin;
    }

    public async Task DeleteAdminAsync(Guid id)
    {
        var admin = await dbContext.Admins.FirstOrDefaultAsync(admins => admins.AdminId == id);
        if (admin is null) return;
        dbContext.Admins.Remove(admin);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Admin?> GetAdminByEmailAsync(string email)
    {
        return await dbContext.Admins.FirstOrDefaultAsync(admin => admin.Email == email);
    }

    public async Task<bool> AdminExistsAsync(string? email, string? phone)
    {
        return await dbContext.Admins.AnyAsync(admin => admin.Email == email || admin.Phone == phone);
    }

    public async Task<Admin?> GetAdminByIdAsync(Guid id)
    {
        return await dbContext.Admins.FirstOrDefaultAsync(admin => admin.AdminId == id);
    }
}