using AutoMapper;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Entities;

namespace BookStore.BusinessLogic.Mapping;

public class FeedbackProfile : Profile
{
    public FeedbackProfile()
    {
        CreateMap<Feedback, FeedbackResponseDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.Fullname));
    }
}
