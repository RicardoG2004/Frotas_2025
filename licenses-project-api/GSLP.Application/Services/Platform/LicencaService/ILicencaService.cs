using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Application.Services.Platform.LicencaService.Filters;

namespace GSLP.Application.Services.Platform.LicencaService
{
    public interface ILicencaService : ITransientService
    {
        #region [-- LICENCA - API METHODS --]

        Task<Response<IEnumerable<LicencaDTO>>> GetLicencasResponseAsync(string keyword = "");
        Task<PaginatedResponse<LicencaDTO>> GetLicencasPaginatedResponseAsync(
            LicencaTableFilter filter
        );
        Task<Response<LicencaDTO>> GetLicencaResponseAsync(Guid id);
        Task<Response<Guid>> CreateLicencaResponseAsync(CreateLicencaRequest request);
        Task<Response<Guid>> UpdateLicencaResponseAsync(UpdateLicencaRequest request, Guid id);
        Task<Response<Guid>> DeleteLicencaResponseAsync(Guid id);
        Task<
            Response<LicencaModulosFuncionalidadesDTO>
        > GetLicencaModulosFuncionalidadesByIdResponseAsync(Guid id);
        Task<Response<LicencaDTO>> GetLicencaByAPIKeyResponseAsync();
        Task<Response<Guid>> ToggleLicencaBlockStatusResponseAsync(
            Guid id,
            bool block,
            string? motivoBloqueio = null
        );
        Task<Response<IEnumerable<LicencaDTO>>> GetLicencasByClienteIdResponseAsync(Guid clienteId);
        Task<Response<List<Guid>>> DeleteLicencasAsync(List<Guid> ids);

        #endregion [-- LICENCA - API METHODS --]

        #region [-- LICENCA - PUBLIC METHODS --]

        Task<LicencaDTO?> GetLicencaByAPIKeyAsync(string APIKey);

        #endregion [-- LICENCA - PUBLIC METHODS --]
    }
}
