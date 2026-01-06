using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaService.DTOs;

namespace GSLP.Application.Services.Platform.LicencaModuloService
{
    public interface ILicencaModuloService : ITransientService
    {
        #region [-- ILICENCAMODULOSERVICE - API METHODS --]

        Task<Response<Guid>> AddModuloToLicencaResponseAsync(Guid licencaId, Guid moduloId);
        Task<Response<List<Guid>>> AddModulosToLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
        );
        Task<Response<Guid>> RemoveModuloFromLicencaResponseAsync(Guid licencaId, Guid moduloId);
        Task<Response<List<Guid>>> RemoveModulosFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
        );
        Task<Response<List<Guid>>> UpdateModulosFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
        );
        Task<
            Response<LicencaModulosFuncionalidadesDTO>
        > GetModulosFuncionalidadesDTOByLicencaIdResponseAsync(Guid licencaId);

        #endregion [-- ILICENCAMODULOSERVICE - API METHODS --]
    }
}
