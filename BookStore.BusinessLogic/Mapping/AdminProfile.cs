using AutoMapper;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Mapping;

public class AdminProfile : Profile
{
    public AdminProfile()
    {
        CreateMap<Admin, AdminResponseDto>();
    }
}
