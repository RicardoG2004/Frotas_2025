using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService
{
    public interface ILicencaUtilizadorService : ITransientService
    {
        #region [-- ILICENCAUTILIZADORSERVICE - API METHODS --]

        Task<Response<Guid>> AddUtilizadorToLicencaResponseAsync(
            Guid licencaId,
            LicencaUtilizadorAssociationRequest request
        );
        Task<Response<List<Guid>>> AddUtilizadoresToLicencaResponseAsync(
            Guid licencaId,
            List<LicencaUtilizadorAssociationRequest> requests
        );
        Task<Response<Guid>> RemoveUtilizadorFromLicencaResponseAsync(
            Guid licencaId,
            string utilizadorId
        );
        Task<Response<List<Guid>>> RemoveUtilizadoresFromLicencaResponseAsync(
            Guid licencaId,
            List<string> utilizadorIds
        );
        Task<Response<Guid>> UpdateLicencaUtilizadorStatusResponseAsync(
            Guid licencaId,
            LicencaUtilizadorAssociationRequest request
        );
        Task<List<string>?> UpdateLicencaUtilizadorStatusResponseAsync(
            Guid licencaId,
            string utilizadorId,
            bool ativo
        );
        Task<Response<List<Guid>>> UpdateLicencaUtilizadoresStatusResponseAsync(
            Guid licencaId,
            List<LicencaUtilizadorAssociationRequest> requests
        );
        Task<Response<IEnumerable<LicencaUtilizadorDTO>>> GetUtilizadoresByLicencaIdResponseAsync(
            Guid licencaId,
            string? role = null
        );

        Task<bool> HasUserAnyLicencaAssociationAsync(string utilizadorId);

        #endregion [-- ILICENCAUTILIZADORSERVICE - API METHODS --]
    }
}
