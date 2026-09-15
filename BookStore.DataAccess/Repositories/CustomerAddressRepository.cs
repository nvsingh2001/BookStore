using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.DataAccess.Repositories;

public class CustomerAddressRepository(ApplicationDbContext dbContext) : ICustomerAddressRepository
{
    public async Task<CustomerAddress> CreateAddressAsync(CustomerAddress address)
    {
        dbContext.CustomerAddresses.Add(address);
        await dbContext.SaveChangesAsync();
        return address;
    }

    public async Task<CustomerAddress?> GetAddressByIdAsync(Guid id)
    {
        return await dbContext.CustomerAddresses.FirstOrDefaultAsync(address => address.AddressId == id);
    }

    public async Task<IEnumerable<CustomerAddress>> GetAddressesByUserIdAsync(Guid userId)
    {
        return await dbContext.CustomerAddresses.Where(address => address.UserId == userId).ToListAsync();
    }

    public async Task<CustomerAddress> UpdateAddressAsync(CustomerAddress address)
    {
        dbContext.CustomerAddresses.Update(address);
        await dbContext.SaveChangesAsync();
        return address;
    }

    public async Task DeleteAddressAsync(Guid id)
    {
        var address = await dbContext.CustomerAddresses.FirstOrDefaultAsync(a => a.AddressId == id);
        if (address is null) return;

        dbContext.CustomerAddresses.Remove(address);
        await dbContext.SaveChangesAsync();
    }
}
