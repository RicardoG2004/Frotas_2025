using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Common.Mailer
{
  public interface IMailService : ITransientService
  {
    Task SendAsync(MailRequest request);
  }
}
