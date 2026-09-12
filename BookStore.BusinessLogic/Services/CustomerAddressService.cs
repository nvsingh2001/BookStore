using AutoMapper;
using BookStore.BusinessLogic.Exceptions;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DataAccess.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Services;

public class CustomerAddressService(
    ICustomerAddressRepository customerAddressRepository,
    IMapper mapper) : ICustomerAddressService
{
    public async Task<CustomerAddressResponseDto> UpsertDefaultAddressAsync(Guid userId,
        CustomerAddressRequestDto dto)
    {
        var addresses = await customerAddressRepository.GetAddressesByUserIdAsync(userId);
        var currentDefault = addresses.FirstOrDefault(address => address.IsDefault);

        if (currentDefault is not null)
        {
            currentDefault.IsDefault = false;
            await customerAddressRepository.UpdateAddressAsync(currentDefault);
        }

        var newAddress = new CustomerAddress
        {
            UserId = userId,
            AddressType = dto.AddressType,
            FullAddress = dto.FullAddress,
            City = dto.City,
            State = dto.State,
            IsDefault = true
        };

        var result = await customerAddressRepository.CreateAddressAsync(newAddress);

        return mapper.Map<CustomerAddressResponseDto>(result);
    }

    public async Task<CustomerAddress> GetDefaultAddressAsync(Guid userId)
    {
        var addresses = await customerAddressRepository.GetAddressesByUserIdAsync(userId);
        var defaultAddress = addresses.FirstOrDefault(address => address.IsDefault);

        if (defaultAddress is null)
            throw new ConflictException("No default address set for this user");

        return defaultAddress;
    }
}
