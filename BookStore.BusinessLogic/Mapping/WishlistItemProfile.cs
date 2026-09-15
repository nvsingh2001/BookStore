using AutoMapper;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Mapping;

public class WishlistItemProfile : Profile
{
    public WishlistItemProfile()
    {
        CreateMap<WishlistItem, WishlistItemResponseDto>();
    }
}
