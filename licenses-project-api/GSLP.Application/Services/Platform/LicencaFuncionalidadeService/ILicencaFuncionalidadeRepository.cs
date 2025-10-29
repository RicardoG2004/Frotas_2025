using GSLP.Application.Common.Marker;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService
{
    public interface ILicencaFuncionalidadeRepository : ITransientService
    {
        Task AddAsync(Guid licencaId, Guid funcionalidadeId);
        Task RemoveAsync(Guid licencaId, Guid funcionalidadeId);
        Task RemoveLicencaFuncionalidadeWithAssociationsAsync(
            Guid licencaId,
            Guid funcionalidadeId
        );
        Task UpdateAsync(Guid licencaId, Guid funcionalidadeId);
        Task<bool> RelationshipExistsAsync(Guid licencaId, Guid funcionalidadeId);
        Task<IEnumerable<Funcionalidade>> GetFuncionalidadesByLicencaIdAsync(Guid licencaId);
    }
}
