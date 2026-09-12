using BookStore.DomainModel.Enums;

namespace BookStore.BusinessLogic.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Guid userId, string email, UserRole role);
}