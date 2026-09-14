using BookStore.BusinessLogic.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace BookStore.Infrastructure.Email;

public class MailKitEmailSender(IConfiguration configuration, ILogger<MailKitEmailSender> logger) : IEmailSender
{
    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(configuration["Smtp:FromName"], configuration["Smtp:FromAddress"]!));

            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            using var smtpClient = new SmtpClient();
            await smtpClient.ConnectAsync(configuration["Smtp:Host"]!, int.Parse(configuration["Smtp:Port"]!));

            if (configuration["Smtp:Username"] != null)
                await smtpClient.AuthenticateAsync(configuration["Smtp:Username"]!, configuration["Smtp:Password"]!);

            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Error sending email");
        }
    }
}