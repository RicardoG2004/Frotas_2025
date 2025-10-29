using AutoMapper;
using AutoMapper.QueryableExtensions;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GSLP.Infrastructure.Persistence.Repository.Platform
{
    public class PerfilUtilizadorRepository : IPerfilUtilizadorRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public PerfilUtilizadorRepository(
            ApplicationDbContext context,
            IMapper mapper,
            UserManager<ApplicationUser> userManager
        )
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task AddAsync(Guid perfilId, string utilizadorId)
        {
            PerfilUtilizador perfilUtilizador = new()
            {
                PerfilId = perfilId,
                UtilizadorId = utilizadorId,
            };

            _ = await _context.PerfisUtilizadores.AddAsync(perfilUtilizador);
            _ = await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Guid perfilId, string utilizadorId)
        {
            PerfilUtilizador perfilUtilizador =
                await _context.PerfisUtilizadores.FirstOrDefaultAsync(pu =>
                    pu.PerfilId == perfilId && pu.UtilizadorId == utilizadorId
                );

            if (perfilUtilizador != null)
            {
                _ = _context.PerfisUtilizadores.Remove(perfilUtilizador);
                _ = await _context.SaveChangesAsync();
            }
        }

        // Remove all PerfilUtilizador associations for a specific UtilizadorId
        public async Task RemoveByUtilizadorIdAsync(
            string utilizadorId,
            IDbContextTransaction transaction
        )
        {
            List<PerfilUtilizador> perfilUtilizadoresToRemove = await _context
                .PerfisUtilizadores.Where(pu => pu.UtilizadorId == utilizadorId)
                .ToListAsync();

            if (perfilUtilizadoresToRemove.Count > 0)
            {
                _context.PerfisUtilizadores.RemoveRange(perfilUtilizadoresToRemove);
                _ = await _context.SaveChangesAsync(); // Save the changes
            }
        }

        // Update properties of an existing relationship between Perfil and Utilizador (
        public async Task UpdateAsync(Guid perfilId, string utilizadorId)
        {
            // Retrieve the existing PerfilUtilizador association
            PerfilUtilizador perfilUtilizador =
                await _context.PerfisUtilizadores.FirstOrDefaultAsync(pu =>
                    pu.PerfilId == perfilId && pu.UtilizadorId == utilizadorId
                );

            if (perfilUtilizador == null)
            {
                throw new InvalidOperationException(
                    "A associação entre o perfil e o utilizador não existe."
                );
            }

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        // Check if a relationship exists between a Perfil and Utilizador
        public async Task<bool> RelationshipExistsAsync(Guid perfilId, string utilizadorId)
        {
            return await _context.PerfisUtilizadores.AnyAsync(pu =>
                pu.PerfilId == perfilId && pu.UtilizadorId == utilizadorId
            );
        }

        // public async Task<IEnumerable<UserDto>> GetUtilizadoresByPerfilIdAsync(Guid perfilId)
        // {
        //     return await _context.PerfisUtilizadores
        //          .Where(pu => pu.PerfilId == perfilId)
        //          .Include(pu => pu.Utilizador)
        //          .ProjectTo<UserDto>(_mapper.ConfigurationProvider)  // Using ProjectTo with AutoMapper
        //          .ToListAsync();
        // }

        // Get all Utilizadores associated with a specific Perfil, filtering by RoleId
        public async Task<IEnumerable<UserDto>> GetUtilizadoresByPerfilIdAsync(
            Guid perfilId,
            string roleId
        )
        {
            // Step 1: Fetch users based on perfilId (without filtering by RoleId yet)
            IQueryable<ApplicationUser> query = _context
                .PerfisUtilizadores.Include(pu => pu.Utilizador.Cliente) // Include any related entities (e.g., Cliente)
                .Where(pu => pu.PerfilId == perfilId)
                .Select(pu => pu.Utilizador); // Select the ApplicationUser (Utilizador) object

            // Step 2: Convert to a list of users
            List<ApplicationUser> usersList = await query.ToListAsync();

            // Step 3: Assign roles to each user
            foreach (ApplicationUser user in usersList)
            {
                // Fetch roles asynchronously for each user
                IList<string> roles = await _userManager.GetRolesAsync(user);

                // Assign the first role to RoleId (assuming each user has one role)
                user.RoleId = roles.FirstOrDefault(); // Ensure user.RoleId exists in your ApplicationUser class
            }

            // Step 4: Apply roleId filter after roles have been assigned
            if (!string.IsNullOrEmpty(roleId))
            {
                usersList = usersList.Where(u => u.RoleId == roleId).ToList();
            }

            // Step 5: Use AutoMapper to map ApplicationUser to UserDto
            List<UserDto> result = _mapper.Map<List<UserDto>>(usersList);

            // Step 6: Return the result
            return result;
        }

        // Get all Perfis associated with a specific UtilizadorId
        public async Task<IEnumerable<PerfilDTO>> GetPerfisByUtilizadorIdAsync(string utilizadorId)
        {
            return await _context
                .PerfisUtilizadores.Where(pu => pu.UtilizadorId == utilizadorId)
                .Select(pu => pu.Perfil)
                .ProjectTo<PerfilDTO>(_mapper.ConfigurationProvider) // Projecting to PerfilDTO
                .ToListAsync();
        }
    }
}
