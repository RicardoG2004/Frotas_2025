using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.Filters;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService
{
    public interface IPerfilService : ITransientService
    {
        #region [-- IPERFILSERVICE - API METHODS --]

        Task<Response<IEnumerable<PerfilDTO>>> GetPerfisResponseAsync(string keyword = "");
        Task<PaginatedResponse<PerfilDTO>> GetPerfisPaginatedResponseAsync(
            PerfilTableFilter filter
        );
        Task<Response<PerfilDTO>> GetPerfilResponseAsync(Guid id);
        Task<Response<Guid>> CreatePerfilResponseAsync(CreatePerfilRequest request);
        Task<Response<Guid>> UpdatePerfilResponseAsync(UpdatePerfilRequest request, Guid id);
        Task<Response<Guid>> DeletePerfilResponseAsync(Guid id);
        Task<Response<List<Guid>>> DeletePerfisAsync(List<Guid> ids);
        Task<Response<IEnumerable<PerfilBasicDTO>>> GetPerfisFromLicencaResponseAsync(
            Guid licencaId,
            string keyword = ""
        );
        Task<Response<PerfilBasicDTO>> GetPerfilByIdFromLicencaResponseAsync(
            Guid licencaId,
            Guid id
        );
        Task<Response<Guid>> CreatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            CreatePerfilBasicRequest request
        );
        Task<Response<Guid>> UpdatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            UpdatePerfilRequest request,
            Guid id
        );
        Task<Response<Guid>> DeletePerfilFromLicencaResponseAsync(Guid licencaId, Guid id);
        Task<PaginatedResponse<PerfilBasicDTO>> GetPerfisFromLicencaPaginatedResponseAsync(
            Guid licencaId,
            PerfilTableFilter filter
        );
        Task<Response<List<Guid>>> DeletePerfisFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> ids
        );

        #endregion [-- IPERFILSERVICE - API METHODS --]

        #region [-- IPERFILSERVICE - INTERNAL METHODS --]

        #endregion [-- IPERFILSERVICE - INTERNAL METHODS --]

        #region [-- IPERFILSERVICE - PUBLIC METHODS --]

        Task<Perfil?> GetPerfilByUtilizadorIdAndLicenseIdAsync(string utilizadorId, Guid licencaId);

        #endregion [-- IPERFILSERVICE - PUBLIC METHODS --]
    }
}
