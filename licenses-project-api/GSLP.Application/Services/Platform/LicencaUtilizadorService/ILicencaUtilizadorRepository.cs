using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService
{
    public interface ILicencaUtilizadorRepository : ITransientService
    {
        Task AddAsync(Guid licencaId, string utilizadorId, bool ativo);
        Task AddAsync(Guid licencaId, LicencaUtilizadorAssociationRequest request);
        Task RemoveAsync(Guid licencaId, string utilizadorId);
        Task RemoveLicencaUtilizadorWithAssociationsAsync(Guid licencaId, string utilizadorId);
        Task UpdateAsync(Guid licencaId, string utilizadorId, bool ativo);
        Task UpdateAsync(Guid licencaId, LicencaUtilizadorAssociationRequest request);
        Task<bool> RelationshipExistsAsync(Guid licencaId, string utilizadorId);
        Task<bool> HasUserAnyLicencaAssociationAsync(string utilizadorId);
        Task<IEnumerable<LicencaUtilizadorDTO>> GetUtilizadoresByLicencaIdAsync(
            Guid licencaId,
            string roleId
        );
        Task<int> GetUtilizadoresAtivosCountByLicencaIdAsync(Guid licencaId);
        Task<IEnumerable<LicencaUtilizador>> GetExistingLicencaAssociationsAsync(
            string utilizadorId,
            Guid excludeLicencaId
        );
        Task<Guid?> GetUserLicencaIdAsync(string utilizadorId);
    }
}
