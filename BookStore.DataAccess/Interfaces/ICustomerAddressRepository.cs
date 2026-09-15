using BookStore.DomainModel.Entities;

namespace BookStore.DataAccess.Interfaces;

public interface ICustomerAddressRepository
{
    Task<CustomerAddress> CreateAddressAsync(CustomerAddress address);
    Task<CustomerAddress?> GetAddressByIdAsync(Guid id);
    Task<IEnumerable<CustomerAddress>> GetAddressesByUserIdAsync(Guid userId);
    Task<CustomerAddress> UpdateAddressAsync(CustomerAddress address);
    Task DeleteAddressAsync(Guid id);
}
