using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaAPIKeyService
{
    public interface ILicencaAPIKeyService : ITransientService
    {
        #region [-- ILICENCAAPIKEYSERVICE - API METHODS --]

        Task<Response<Guid>> CreateLicencaAPIKeyResponseAsync(Guid licencaId);
        Task<Response<Guid>> SetLicencaAPIKeyStatusResponseAsync(
            Guid licencaId,
            SetLicencaAPIKeyStatusRequest request
        );
        Task<Response<Guid>> RegenerateLicencaAPIKeyResponseAsync(Guid licencaId);
        Task<Response<LicencaAPIKeyDTO>> GetLicencaAPIKeyResponseAsync(Guid licencaId);

        #endregion [-- ILICENCAAPIKEYSERVICE - API METHODS --]
    }
}
