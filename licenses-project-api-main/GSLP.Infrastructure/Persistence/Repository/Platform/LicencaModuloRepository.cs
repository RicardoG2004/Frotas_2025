using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService;
using GSLP.Application.Services.Platform.LicencaModuloService.DTOs;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Repository.Platform
{
    public class LicencaModuloRepository : ILicencaModuloRepository
    {
        private readonly ApplicationDbContext _context;

        public LicencaModuloRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Guid licencaId, Guid moduloId)
        {
            LicencaModulo licencaModulo = new() { LicencaId = licencaId, ModuloId = moduloId };

            _ = await _context.LicencasModulos.AddAsync(licencaModulo);
            _ = await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Guid licencaId, Guid moduloId)
        {
            LicencaModulo licencaModulo = await _context.LicencasModulos.FirstOrDefaultAsync(pf =>
                pf.LicencaId == licencaId && pf.ModuloId == moduloId
            );

            if (licencaModulo != null)
            {
                _ = _context.LicencasModulos.Remove(licencaModulo);
                _ = await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Guid licencaId, Guid moduloId)
        {
            // Retrieve the existing LicencaModulo association
            LicencaModulo licencaModulo = await _context.LicencasModulos.FirstOrDefaultAsync(pf =>
                pf.LicencaId == licencaId && pf.ModuloId == moduloId
            );

            if (licencaModulo == null)
            {
                throw new InvalidOperationException(
                    "A associação entre a licença e o modulo não existe."
                );
            }

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        public async Task<bool> RelationshipExistsAsync(Guid licencaId, Guid moduloId)
        {
            return await _context.LicencasModulos.AnyAsync(pf =>
                pf.LicencaId == licencaId && pf.ModuloId == moduloId
            );
        }

        public async Task<bool> IsModuloUsedAsync(Guid moduloId)
        {
            // Check if any Funcionalidade in Licenca is associated with this Modulo
            return await _context.LicencasFuncionalidades.AnyAsync(lf =>
                lf.Funcionalidade.ModuloId == moduloId
            );
        }

        public async Task<IEnumerable<Modulo>> GetModulosByLicencaIdAsync(Guid licencaId)
        {
            return await _context
                .LicencasModulos.Where(pf => pf.LicencaId == licencaId)
                .Select(pf => pf.Modulo)
                .ToListAsync();
        }

        public async Task<LicencaModulosFuncionalidadesDTO> GetModulosAndFuncionalidadesDTOByLicencaIdAsync(
            Guid licencaId
        )
        {
            List<LicencaModuloNomeDTO> modulos = await _context
                .LicencasModulos.Where(pf => pf.LicencaId == licencaId)
                .Select(pf => new LicencaModuloNomeDTO
                {
                    Id = pf.Modulo.Id,
                    Nome = pf.Modulo.Nome,
                    AplicacaoId = pf.Modulo.AplicacaoId,
                })
                .ToListAsync();

            List<LicencaFuncionalidadeNomeDTO> funcionalidades = await _context
                .LicencasFuncionalidades.Where(pf => pf.LicencaId == licencaId)
                .Select(pf => new LicencaFuncionalidadeNomeDTO
                {
                    Id = pf.Funcionalidade.Id.ToString(),
                    Nome = pf.Funcionalidade.Nome,
                    ModuloId = pf.Funcionalidade.ModuloId.ToString(),
                })
                .ToListAsync();

            return new LicencaModulosFuncionalidadesDTO
            {
                Modulos = modulos,
                Funcionalidades = funcionalidades,
            };
        }

        public async Task<List<LicencaModulo>> GetLicencaModulosByPerfilIdAsync(Guid perfilId)
        {
            return await _context
                .LicencasModulos.Where(lm => lm.Licenca.Perfis.Any(p => p.Id == perfilId)) // Filter by perfilId
                .Include(lm => lm.Modulo)
                .ThenInclude(m => m.Funcionalidades) // Include funcionalidades of each modulo
                .ToListAsync();
        }
    }
}
