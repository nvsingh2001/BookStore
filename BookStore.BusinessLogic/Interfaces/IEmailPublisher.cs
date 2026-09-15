using BookStore.DomainModel.Messaging;

namespace BookStore.BusinessLogic.Interfaces;

public interface IEmailPublisher
{
    Task PublishAsync(EmailRequestedMessage message);
}