using BookStore.DomainModel.Enums;

namespace BookStore.DomainModel.DTOs;

public class CustomerAddressResponseDto
{
    public string AddressId { get; set; }
    public AddressType AddressType { get; set; }
    public string FullAddress { get; set; }
    public string City { get; set; }
    public string State { get; set; }
}