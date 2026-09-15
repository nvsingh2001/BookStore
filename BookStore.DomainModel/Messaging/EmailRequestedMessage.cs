namespace BookStore.DomainModel.Messaging;

public record EmailRequestedMessage(Guid UserId, string Email, string Subject, string Body);