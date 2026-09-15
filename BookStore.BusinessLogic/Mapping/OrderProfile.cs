using AutoMapper;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Mapping;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<OrderItem, OrderItemResponseDto>();

        CreateMap<Order, OrderResponseDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.OrderDate))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => new CustomerAddressResponseDto
            {
                AddressId = src.AddressId != null ? src.AddressId.ToString() : null,
                AddressType = src.ShippingAddressType,
                FullAddress = src.ShippingFullAddress,
                City = src.ShippingCity,
                State = src.ShippingState
            }));
    }
}