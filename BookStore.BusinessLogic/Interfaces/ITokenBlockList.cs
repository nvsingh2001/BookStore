namespace BookStore.BusinessLogic.Interfaces;

public interface ITokenBlockList
{
    Task<bool> IsTokenBlockedAsync(string jti);
    Task BlockTokenAsync(string jti, TimeSpan ttl);
}