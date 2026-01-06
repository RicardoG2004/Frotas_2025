using AutoMapper;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Services.Platform.LicencaUtilizadorService;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Repository.Platform
{
    public class LicencaUtilizadorRepository : ILicencaUtilizadorRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPerfilUtilizadorRepository _perfilUtilizadorRepository;

        public LicencaUtilizadorRepository(
            ApplicationDbContext context,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IPerfilUtilizadorRepository perfilUtilizadorRepository
        )
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _perfilUtilizadorRepository = perfilUtilizadorRepository;
        }

        public async Task AddAsync(Guid licencaId, string utilizadorId, bool ativo)
        {
            LicencaUtilizador licencaUtilizador = new()
            {
                LicencaId = licencaId,
                UtilizadorId = utilizadorId,
                Ativo = ativo,
            };

            _ = await _context.LicencasUtilizadores.AddAsync(licencaUtilizador);
            _ = await _context.SaveChangesAsync();
        }

        public async Task AddAsync(Guid licencaId, LicencaUtilizadorAssociationRequest request)
        {
            LicencaUtilizador licencaUtilizador = new()
            {
                LicencaId = licencaId,
                UtilizadorId = request.UtilizadorId,
                Ativo = request.Ativo ?? false,
            };

            _ = await _context.LicencasUtilizadores.AddAsync(licencaUtilizador);
            _ = await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Guid licencaId, string utilizadorId)
        {
            LicencaUtilizador licencaUtilizador =
                await _context.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
                    lu.LicencaId == licencaId && lu.UtilizadorId == utilizadorId
                );

            if (licencaUtilizador != null)
            {
                _ = _context.LicencasUtilizadores.Remove(licencaUtilizador);
                _ = await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveLicencaUtilizadorWithAssociationsAsync(
            Guid licencaId,
            string utilizadorId
        )
        {
            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction transaction =
                await _context.Database.BeginTransactionAsync(); // Start a transaction

            try
            {
                // Remove LicencaUtilizador
                LicencaUtilizador licencaUtilizador =
                    await _context.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
                        lu.LicencaId == licencaId && lu.UtilizadorId == utilizadorId
                    );

                if (licencaUtilizador != null)
                {
                    _ = _context.LicencasUtilizadores.Remove(licencaUtilizador); // Remove the LicencaUtilizador
                    _ = await _context.SaveChangesAsync(); // Save the changes
                }

                // Call to PerfilUtilizadorRepository to remove associated entries
                await _perfilUtilizadorRepository.RemoveByUtilizadorIdAsync(
                    utilizadorId,
                    transaction
                );

                await transaction.CommitAsync(); // Commit the transaction
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // If any error occurs, rollback the transaction
                throw new Exception(
                    "Ocorreu um erro ao remover LicencaUtilizador e os PerfilUtilizadores relacionados",
                    ex
                );
            }
        }

        public async Task UpdateAsync(Guid licencaId, string utilizadorId, bool ativo)
        {
            // Retrieve the existing LicencaUtilizador association
            LicencaUtilizador licencaUtilizador =
                await _context.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
                    lu.LicencaId == licencaId && lu.UtilizadorId == utilizadorId
                );

            if (licencaUtilizador == null)
            {
                throw new InvalidOperationException(
                    "A associação entre a licença e o utilizador não existe."
                );
            }

            licencaUtilizador.Ativo = ativo;

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid licencaId, LicencaUtilizadorAssociationRequest request)
        {
            // Retrieve the existing LicencaUtilizador association
            LicencaUtilizador licencaUtilizador =
                await _context.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
                    lu.LicencaId == licencaId && lu.UtilizadorId == request.UtilizadorId!
                );

            if (licencaUtilizador == null)
            {
                throw new InvalidOperationException(
                    "A associação entre a licença e o utilizador não existe."
                );
            }

            licencaUtilizador.Ativo = request.Ativo ?? false;

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        public async Task<bool> RelationshipExistsAsync(Guid licencaId, string utilizadorId)
        {
            return await _context.LicencasUtilizadores.AnyAsync(lu =>
                lu.LicencaId == licencaId && lu.UtilizadorId == utilizadorId
            );
        }

        public async Task<bool> HasUserAnyLicencaAssociationAsync(string utilizadorId)
        {
            return await _context.LicencasUtilizadores.AnyAsync(lu =>
                lu.UtilizadorId == utilizadorId
            );
        }

        public async Task<IEnumerable<LicencaUtilizadorDTO>> GetUtilizadoresByLicencaIdAsync(
            Guid licencaId,
            string roleId
        )
        {
            // Step 1: Fetch LicencaUtilizadores based on licencaId
            List<LicencaUtilizador> licencaUtilizadores = await _context
                .LicencasUtilizadores.Include(lu => lu.Utilizador.Cliente)
                .Include(lu => lu.Utilizador.PerfisUtilizadores)
                .Where(lu => lu.LicencaId == licencaId)
                .ToListAsync();

            // Step 2: Create a list to hold the DTOs
            List<LicencaUtilizadorDTO> result = [];

            // Step 3: Assign roles and map to DTO
            foreach (LicencaUtilizador lu in licencaUtilizadores)
            {
                ApplicationUser user = lu.Utilizador;

                // Fetch roles asynchronously for each user
                IList<string> roles = await _userManager.GetRolesAsync(user);
                user.RoleId = roles.FirstOrDefault(); // Assuming user.RoleId exists in your ApplicationUser class

                // Map to LicencaUtilizadorDTO
                result.Add(
                    new LicencaUtilizadorDTO
                    {
                        Utilizador = _mapper.Map<UserDto>(user), // Map ApplicationUser to UserDto
                        Ativo = lu.Ativo, // Use Ativo from LicencaUtilizador
                    }
                );
            }

            // Step 4: Apply roleId filter if provided
            if (!string.IsNullOrEmpty(roleId))
            {
                result = result.Where(dto => dto.Utilizador.RoleId == roleId).ToList();
            }

            // Step 5: Return the result
            return result;
        }

        public async Task<int> GetUtilizadoresAtivosCountByLicencaIdAsync(Guid licencaId)
        {
            // Get all active users associated with the license
            List<LicencaUtilizador> licencaUtilizadores = await _context
                .LicencasUtilizadores.Include(lu => lu.Utilizador)
                .Where(lu => lu.LicencaId == licencaId && lu.Ativo)
                .ToListAsync();

            int clientCount = 0;

            // Check each user's role and count only those with "client" role
            foreach (LicencaUtilizador lu in licencaUtilizadores)
            {
                IList<string> roles = await _userManager.GetRolesAsync(lu.Utilizador);
                if (roles.Contains("client"))
                {
                    clientCount++;
                }
            }

            return clientCount;
        }

        // public async Task<int> CountClientUtilizadoresByLicencaIdAsync(Guid licencaId)
        // {
        //     // Step 1: Fetch LicencaUtilizadores based on licencaId
        //     List<LicencaUtilizador> licencaUtilizadores = await _context.LicencasUtilizadores
        //         .Include(lu => lu.Utilizador)
        //         .Where(lu => lu.LicencaId == licencaId)
        //         .ToListAsync();

        //     // Step 2: Count users with the "client" role
        //     int clientCount = 0;

        //     foreach (LicencaUtilizador lu in licencaUtilizadores)
        //     {
        //         ApplicationUser user = lu.Utilizador;
        //         IList<string> roles = await _userManager.GetRolesAsync(user);

        //         if (roles.Contains("client"))
        //         {
        //             clientCount++;
        //         }
        //     }

        //     // Step 3: Return the count
        //     return clientCount;
        // }

        public async Task<IEnumerable<LicencaUtilizador>> GetExistingLicencaAssociationsAsync(
            string utilizadorId,
            Guid excludeLicencaId
        )
        {
            return await _context
                .LicencasUtilizadores.Where(lu =>
                    lu.UtilizadorId == utilizadorId && lu.LicencaId != excludeLicencaId
                )
                .ToListAsync();
        }

        public async Task<Guid?> GetUserLicencaIdAsync(string utilizadorId)
        {
            var licencaUtilizador = await _context.LicencasUtilizadores.FirstOrDefaultAsync(lu =>
                lu.UtilizadorId == utilizadorId
            );

            return licencaUtilizador?.LicencaId;
        }
    }
}
