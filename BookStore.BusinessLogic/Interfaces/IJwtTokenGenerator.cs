namespace BookStore.BusinessLogic.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Guid userId, string email, string role);
}