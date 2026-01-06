using GSLP.Application.Common.Marker;

namespace GSLP.Application.Common.Helper
{
    public interface IHelperService : IScopedService
    {
        Task<string?> GetAPIKeyFromHttpContextAsync();
        Task<Guid?> GetLicencaIdFromHttpContextAsync();
        Task<Guid?> GetClienteIdFromHttpContextAsync();
    }
}
