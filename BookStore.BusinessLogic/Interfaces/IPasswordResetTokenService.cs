namespace BookStore.BusinessLogic.Interfaces;

public interface IPasswordResetTokenService
{
    string GenerateToken(Guid userId, string email);
    Guid ValidateAndExtractUserId(string token);
}