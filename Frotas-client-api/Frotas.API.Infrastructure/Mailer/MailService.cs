using Frotas.API.Application.Common.Mailer;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Frotas.API.Infrastructure.Mailer
{
  public class MailService : IMailService // mailer implentation with MailKit (3rd-party package)
  {
    private readonly MailSettings _settings;

    public MailService(IOptions<MailSettings> settings)
    {
      _settings = settings.Value;
    }

    public async Task SendAsync(MailRequest request)
    {
      // create message
      MimeMessage email = new();
      email.From.Add(new MailboxAddress(_settings.DisplayName, request.From ?? _settings.From));
      email.To.Add(MailboxAddress.Parse(request.To));
      email.Subject = request.Subject;

      BodyBuilder builder = new() { HtmlBody = request.Body };
      email.Body = builder.ToMessageBody();

      // send email
      using SmtpClient smtp = new();
      await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
      await smtp.AuthenticateAsync(_settings.UserName, _settings.Password);
      _ = await smtp.SendAsync(email);
      await smtp.DisconnectAsync(true);
    }
  }
}
