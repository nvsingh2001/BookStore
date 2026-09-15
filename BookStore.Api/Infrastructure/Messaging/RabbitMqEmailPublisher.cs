using System.Text.Json;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.Messaging;
using RabbitMQ.Client;

namespace BookStore.Infrastructure.Messaging;

public class RabbitMqEmailPublisher(IConnection connection, ILogger<RabbitMqEmailPublisher> logger) : IEmailPublisher
{
    public async Task PublishAsync(EmailRequestedMessage message)
    {
        try
        {
            using var channel = await connection.CreateChannelAsync();
            await channel.QueueDeclareAsync("email-queue", true, false, false);

            var body = JsonSerializer.SerializeToUtf8Bytes(message);
            var properties = new BasicProperties { Persistent = true };

            await channel.BasicPublishAsync("", "email-queue", false, properties, body);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to publish email message for {Email}", message.Email);
        }
    }
}