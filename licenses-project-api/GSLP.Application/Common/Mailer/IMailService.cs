using GSLP.Application.Common.Marker;

namespace GSLP.Application.Common.Mailer
{
    public interface IMailService : ITransientService
    {
        Task SendAsync(MailRequest request);
    }
}
