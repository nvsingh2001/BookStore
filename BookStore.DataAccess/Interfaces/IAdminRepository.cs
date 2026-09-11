using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface IAdminRepository
{
    Task<Admin> CreateAdminAsync(Admin admin);
    Task<Admin?> GetAdminByEmailAsync(string email);
    Task<Admin?> GetAdminByIdAsync(Guid id);
    Task<Admin> UpdateAdminAsync(Admin admin);
    Task DeleteAdminAsync(Guid id);
    Task<bool> AdminExistsAsync(string email);
}
