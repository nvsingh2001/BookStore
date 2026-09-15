using System.Text.Json;
using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.Messaging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace BookStore.Infrastructure.Messaging;

public class EmailConsumerService(
    IConnection connection,
    IServiceScopeFactory scopeFactory,
    ILogger<EmailConsumerService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);
        await channel.QueueDeclareAsync("email-queue", durable: true, exclusive: false,
            autoDelete: false, cancellationToken: stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                var message = JsonSerializer.Deserialize<EmailRequestedMessage>(ea.Body.Span);
                if (message is null)
                {
                    logger.LogWarning("Failed to deserialize email message, dropping it");
                    await channel.BasicAckAsync(ea.DeliveryTag, false, stoppingToken);
                    return;
                }

                using var scope = scopeFactory.CreateScope();
                var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();
                var sent = await emailSender.SendEmailAsync(message.Email, message.Subject, message.Body);

                if (sent)
                    await channel.BasicAckAsync(ea.DeliveryTag, false, stoppingToken);
                else
                    await channel.BasicNackAsync(ea.DeliveryTag, false, true, stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected failure processing email message");
                await channel.BasicNackAsync(ea.DeliveryTag, false, true, stoppingToken);
            }
        };

        await channel.BasicConsumeAsync("email-queue", false, consumer, stoppingToken);

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}
