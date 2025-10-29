using GSLP.Application.Services.Platform.LicencaFuncionalidadeService;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Repository.Platform
{
    public class LicencaFuncionalidadeRepository : ILicencaFuncionalidadeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IPerfilFuncionalidadeRepository _perfilFuncionalidadeRepository;

        public LicencaFuncionalidadeRepository(
            ApplicationDbContext context,
            IPerfilFuncionalidadeRepository perfilFuncionalidadeRepository
        )
        {
            _context = context;
            _perfilFuncionalidadeRepository = perfilFuncionalidadeRepository;
        }

        public async Task AddAsync(Guid licencaId, Guid funcionalidadeId)
        {
            LicencaFuncionalidade licencaFuncionalidade = new()
            {
                LicencaId = licencaId,
                FuncionalidadeId = funcionalidadeId,
            };

            _ = await _context.LicencasFuncionalidades.AddAsync(licencaFuncionalidade);
            _ = await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Guid licencaId, Guid funcionalidadeId)
        {
            LicencaFuncionalidade licencaFuncionalidade =
                await _context.LicencasFuncionalidades.FirstOrDefaultAsync(pf =>
                    pf.LicencaId == licencaId && pf.FuncionalidadeId == funcionalidadeId
                );

            if (licencaFuncionalidade != null)
            {
                _ = _context.LicencasFuncionalidades.Remove(licencaFuncionalidade);
                _ = await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveLicencaFuncionalidadeWithAssociationsAsync(
            Guid licencaId,
            Guid funcionalidadeId
        )
        {
            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction transaction =
                await _context.Database.BeginTransactionAsync(); // Start a transaction

            try
            {
                // Remove LicencaFuncionalidade
                LicencaFuncionalidade licencaFuncionalidade =
                    await _context.LicencasFuncionalidades.FirstOrDefaultAsync(lf =>
                        lf.LicencaId == licencaId && lf.FuncionalidadeId == funcionalidadeId
                    );

                if (licencaFuncionalidade != null)
                {
                    _ = _context.LicencasFuncionalidades.Remove(licencaFuncionalidade); // Remove the LicencaFuncionalidade
                    _ = await _context.SaveChangesAsync(); // Save the changes
                }

                // Call to PerfilFuncionalidadeRepository to remove associations
                await _perfilFuncionalidadeRepository.RemoveByFuncionalidadeIdAndLicencaIdAsync(
                    funcionalidadeId,
                    licencaId,
                    transaction
                );

                await transaction.CommitAsync(); // Commit the transaction
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // If any error occurs, rollback the transaction
                // Optionally, log the exception
                throw new Exception(
                    "Ocorreu um erro ao remover LicencaFuncionalidade e as PerfilFuncionalidades relacionadas",
                    ex
                );
            }
        }

        public async Task UpdateAsync(Guid licencaId, Guid funcionalidadeId)
        {
            // Retrieve the existing LicencaFuncionalidade association
            LicencaFuncionalidade licencaFuncionalidade =
                await _context.LicencasFuncionalidades.FirstOrDefaultAsync(pf =>
                    pf.LicencaId == licencaId && pf.FuncionalidadeId == funcionalidadeId
                );

            if (licencaFuncionalidade == null)
            {
                throw new InvalidOperationException(
                    "A associação entre a licença e a funcionalidade não existe."
                );
            }

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        public async Task<bool> RelationshipExistsAsync(Guid licencaId, Guid funcionalidadeId)
        {
            return await _context.LicencasFuncionalidades.AnyAsync(pf =>
                pf.LicencaId == licencaId && pf.FuncionalidadeId == funcionalidadeId
            );
        }

        public async Task<IEnumerable<Funcionalidade>> GetFuncionalidadesByLicencaIdAsync(
            Guid licencaId
        )
        {
            return await _context
                .LicencasFuncionalidades.Where(pf => pf.LicencaId == licencaId)
                .Select(pf => pf.Funcionalidade)
                .ToListAsync();
        }
    }
}
