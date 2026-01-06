using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService
{
    public interface IPerfilFuncionalidadeService : ITransientService
    {
        #region [-- IPERFILFUNCIONALIDADESERVICE - API METHODS --]

        Task<Response<Guid>> AddFuncionalidadeToPerfilResponseAsync(
            Guid perfilId,
            Guid funcionalidadeId,
            PerfilFuncionalidadeOptionsAssociationRequest request
        );
        Task<Response<List<Guid>>> AddFuncionalidadesToPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        );
        Task<Response<List<Guid>>> AddOrUpdateFuncionalidadesToPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        );
        Task<Response<Guid>> RemoveFuncionalidadeFromPerfilResponseAsync(
            Guid perfilId,
            Guid funcionalidadeId
        );
        Task<Response<List<Guid>>> RemoveFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<Guid> funcionalidadesIds
        );
        Task<Response<List<Guid>>> UpdateFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        );
        Task<
            Response<IEnumerable<PerfilFuncionalidadeDTO>>
        > GetPerfilFuncionalidadesDTOByPerfilIdResponseAsync(Guid perfilId);
        Task<
            Response<PerfilModulosFuncionalidadesTreeDTO>
        > GetModulosFuncionalidadesTreeByPerfilIdResponseAsync(Guid perfilId);

        Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByPerfilIdAsync(Guid perfilId);
        Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByUtilizadorIdAsync(
            string utilizadorId
        );

        #endregion [-- IPERFILFUNCIONALIDADESERVICE - API METHODS --]
    }
}
