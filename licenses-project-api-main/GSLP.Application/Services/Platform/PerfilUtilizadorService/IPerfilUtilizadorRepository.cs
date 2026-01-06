using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using Microsoft.EntityFrameworkCore.Storage;

namespace GSLP.Application.Services.Platform.PerfilUtilizadorService
{
    public interface IPerfilUtilizadorRepository : ITransientService
    {
        Task AddAsync(Guid perfilId, string utilizadorId);
        Task RemoveAsync(Guid perfilId, string utilizadorId);
        Task RemoveByUtilizadorIdAsync(string utilizadorId, IDbContextTransaction transaction);
        Task UpdateAsync(Guid perfilId, string utilizadorId);
        Task<bool> RelationshipExistsAsync(Guid perfilId, string utilizadorId);
        Task<IEnumerable<UserDto>> GetUtilizadoresByPerfilIdAsync(Guid perfilId, string? roleId);
        Task<IEnumerable<PerfilDTO>> GetPerfisByUtilizadorIdAsync(string utilizadorId);
    }
}
