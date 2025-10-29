using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaModuloService
{
    public interface ILicencaModuloRepository : ITransientService
    {
        Task AddAsync(Guid licencaId, Guid moduloId);
        Task RemoveAsync(Guid licencaId, Guid moduloId);
        Task UpdateAsync(Guid licencaId, Guid moduloId);
        Task<bool> RelationshipExistsAsync(Guid licencaId, Guid moduloId);
        Task<bool> IsModuloUsedAsync(Guid moduloId);
        Task<IEnumerable<Modulo>> GetModulosByLicencaIdAsync(Guid licencaId);
        Task<LicencaModulosFuncionalidadesDTO> GetModulosAndFuncionalidadesDTOByLicencaIdAsync(
            Guid licencaId
        );
        Task<List<LicencaModulo>> GetLicencaModulosByPerfilIdAsync(Guid perfilId);
    }
}
