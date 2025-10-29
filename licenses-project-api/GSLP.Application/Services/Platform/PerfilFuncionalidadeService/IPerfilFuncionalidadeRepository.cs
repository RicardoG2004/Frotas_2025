using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;
using Microsoft.EntityFrameworkCore.Storage;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService
{
    public interface IPerfilFuncionalidadeRepository : ITransientService
    {
        Task AddAsync(Guid perfilId, PerfilFuncionalidadeAssociationRequest request);
        Task RemoveAsync(Guid perfilId, Guid funcionalidadeId);
        Task RemoveByFuncionalidadeIdAndLicencaIdAsync(
            Guid funcionalidadeId,
            Guid licencaId,
            IDbContextTransaction transaction
        );
        Task UpdateAsync(Guid perfilId, PerfilFuncionalidadeAssociationRequest request);
        Task<bool> RelationshipExistsAsync(Guid perfilId, Guid funcionalidadeId);
        Task<IEnumerable<PerfilFuncionalidadeDTO>> GetPerfilFuncionalidadesDTOByPerfilIdAsync(
            Guid perfilId
        );
        Task<List<PerfilFuncionalidade>> GetPerfilFuncionalidadesByPerfilIdAsync(Guid perfilId);
        Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByPerfilIdAsync(Guid perfilId);
    }
}
