namespace BookStore.BusinessLogic.Interfaces;

public interface IEmailVerificationTokenService
{
    string GenerateToken(Guid userId, string email);
    Guid ValidateAndExtractUserId(string token);
}