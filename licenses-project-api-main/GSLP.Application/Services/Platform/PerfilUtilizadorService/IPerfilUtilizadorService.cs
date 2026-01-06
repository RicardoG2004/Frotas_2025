using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilService.DTOs;

namespace GSLP.Application.Services.Platform.PerfilUtilizadorService
{
    public interface IPerfilUtilizadorService : ITransientService
    {
        #region [-- PERFILUTILIZADORSERVICE - API METHODS --]

        Task<Response<Guid>> AddUtilizadorToPerfilResponseAsync(Guid perfilId, string utilizadorId);
        Task<Response<List<Guid>>> AddUtilizadoresToPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        );
        Task<Response<Guid>> RemoveUtilizadorFromPerfilResponseAsync(
            Guid perfilId,
            string utilizadorId
        );
        Task<Response<List<Guid>>> RemoveUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        );
        Task<Response<List<string>>> UpdateUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        );
        Task<List<string>?> UpdateUtilizadorWithOnePerfilAsync(Guid perfilId, string utilizadorId);
        Task<IEnumerable<PerfilDTO>> GetPerfisByUtilizadorIdAsync(string utilizadorId);
        Task<Response<IEnumerable<UserDto>>> GetUtilizadoresByPerfilIdResponseAsync(
            Guid perfilId,
            string? role = null
        );

        #endregion [-- PERFILUTILIZADORSERVICE - API METHODS --]
    }
}
