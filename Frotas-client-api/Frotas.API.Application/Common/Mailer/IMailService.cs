using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Common.Mailer
{
  public interface IMailService : ITransientService
  {
    Task SendAsync(MailRequest request);
  }
}
