using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService
{
    public interface ILicencaFuncionalidadeService : ITransientService
    {
        #region [-- ILICENCAFUNCIONALIDADESERVICE - API METHODS --]

        Task<Response<Guid>> AddFuncionalidadeToLicencaResponseAsync(
            Guid licencaId,
            Guid funcionalidadeId
        );
        Task<Response<List<Guid>>> AddFuncionalidadesToLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        );
        Task<Response<Guid>> RemoveFuncionalidadeFromLicencaResponseAsync(
            Guid licencaId,
            Guid funcionalidadeId
        );
        Task<Response<List<Guid>>> RemoveFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        );
        Task<Response<List<Guid>>> UpdateFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        );
        Task<Response<List<Guid>>> UpdateModulosFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<UpdateModulosFuncionalidadesRequest> request
        );

        #endregion [-- ILICENCAFUNCIONALIDADESERVICE - API METHODS --]
    }
}
