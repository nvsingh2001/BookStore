using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Interfaces;

public interface ICustomerAddressService
{
    Task<CustomerAddressResponseDto> UpsertDefaultAddressAsync(Guid userId, CustomerAddressRequestDto dto);
    Task<CustomerAddress> GetDefaultAddressAsync(Guid userId);
    Task<CustomerAddress> GetAddressByIdAsync(Guid userId, Guid addressId);
}
