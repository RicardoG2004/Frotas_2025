using AutoMapper;
using AutoMapper.QueryableExtensions;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GSLP.Infrastructure.Persistence.Repository.Platform
{
    public class PerfilFuncionalidadeRepository : IPerfilFuncionalidadeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PerfilFuncionalidadeRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Add a new relationship between Perfil and Funcionalidade
        public async Task AddAsync(Guid perfilId, PerfilFuncionalidadeAssociationRequest request)
        {
            Guid funcionalidadeId = Guid.Parse(request.FuncionalidadeId);

            PerfilFuncionalidade perfilFuncionalidade = new()
            {
                PerfilId = perfilId,
                FuncionalidadeId = funcionalidadeId,
            };

            // add the properties
            perfilFuncionalidade.AuthVer = request.AuthVer ?? perfilFuncionalidade.AuthVer;
            perfilFuncionalidade.AuthAdd = request.AuthAdd ?? perfilFuncionalidade.AuthAdd;
            perfilFuncionalidade.AuthChg = request.AuthChg ?? perfilFuncionalidade.AuthChg;
            perfilFuncionalidade.AuthDel = request.AuthDel ?? perfilFuncionalidade.AuthDel;
            perfilFuncionalidade.AuthPrt = request.AuthPrt ?? perfilFuncionalidade.AuthPrt;

            _ = await _context.PerfisFuncionalidades.AddAsync(perfilFuncionalidade);
            _ = await _context.SaveChangesAsync();
        }

        // Remove a relationship between Perfil and Funcionalidade
        public async Task RemoveAsync(Guid perfilId, Guid funcionalidadeId)
        {
            PerfilFuncionalidade perfilFuncionalidade =
                await _context.PerfisFuncionalidades.FirstOrDefaultAsync(pf =>
                    pf.PerfilId == perfilId && pf.FuncionalidadeId == funcionalidadeId
                );

            if (perfilFuncionalidade != null)
            {
                _ = _context.PerfisFuncionalidades.Remove(perfilFuncionalidade);
                _ = await _context.SaveChangesAsync();
            }
        }

        // Remove relationships based on FuncionalidadeId and LicencaId
        public async Task RemoveByFuncionalidadeIdAndLicencaIdAsync(
            Guid funcionalidadeId,
            Guid licencaId,
            IDbContextTransaction transaction
        )
        {
            List<PerfilFuncionalidade> perfilFuncionalidadesToRemove = await _context
                .PerfisFuncionalidades.Where(pf =>
                    pf.FuncionalidadeId == funcionalidadeId && pf.Perfil.LicencaId == licencaId
                )
                .ToListAsync();

            if (perfilFuncionalidadesToRemove.Count > 0)
            {
                _context.PerfisFuncionalidades.RemoveRange(perfilFuncionalidadesToRemove);
                _ = await _context.SaveChangesAsync(); // Save the changes
            }
        }

        // Update properties of an existing relationship between Perfil and Funcionalidade
        public async Task UpdateAsync(Guid perfilId, PerfilFuncionalidadeAssociationRequest request)
        {
            Guid funcionalidadeId = Guid.Parse(request.FuncionalidadeId);

            // Retrieve the existing PerfilFuncionalidade association
            PerfilFuncionalidade perfilFuncionalidade =
                await _context.PerfisFuncionalidades.FirstOrDefaultAsync(pf =>
                    pf.PerfilId == perfilId && pf.FuncionalidadeId == funcionalidadeId
                );

            if (perfilFuncionalidade == null)
            {
                throw new InvalidOperationException(
                    "A associação entre o perfil e a funcionalidade não existe."
                );
            }

            // Update the properties
            perfilFuncionalidade.AuthVer = request.AuthVer ?? perfilFuncionalidade.AuthVer;
            perfilFuncionalidade.AuthAdd = request.AuthAdd ?? perfilFuncionalidade.AuthAdd;
            perfilFuncionalidade.AuthChg = request.AuthChg ?? perfilFuncionalidade.AuthChg;
            perfilFuncionalidade.AuthDel = request.AuthDel ?? perfilFuncionalidade.AuthDel;
            perfilFuncionalidade.AuthPrt = request.AuthPrt ?? perfilFuncionalidade.AuthPrt;

            // Save the changes
            _ = await _context.SaveChangesAsync();
        }

        // Check if a relationship exists between a Perfil and Funcionalidade
        public async Task<bool> RelationshipExistsAsync(Guid perfilId, Guid funcionalidadeId)
        {
            return await _context.PerfisFuncionalidades.AnyAsync(pf =>
                pf.PerfilId == perfilId && pf.FuncionalidadeId == funcionalidadeId
            );
        }

        // Get all Funcionalidades for a specific Perfil
        public async Task<
            IEnumerable<PerfilFuncionalidadeDTO>
        > GetPerfilFuncionalidadesDTOByPerfilIdAsync(Guid perfilId)
        {
            return await _context
                .PerfisFuncionalidades.Where(pf => pf.PerfilId == perfilId)
                .Include(pf => pf.Funcionalidade)
                .ProjectTo<PerfilFuncionalidadeDTO>(_mapper.ConfigurationProvider) // Using ProjectTo with AutoMapper
                .ToListAsync();
        }

        // Get all Funcionalidades for a specific Perfil
        public async Task<List<PerfilFuncionalidade>> GetPerfilFuncionalidadesByPerfilIdAsync(
            Guid perfilId
        )
        {
            return await _context
                .PerfisFuncionalidades.Where(pf => pf.PerfilId == perfilId)
                .ToListAsync();
        }

        // Get the permissions for a Perfil as a bitmask (for JWT)
        public async Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByPerfilIdAsync(
            Guid perfilId
        )
        {
            List<PerfilFuncionalidade> funcionalidades = await _context
                .PerfisFuncionalidades.Where(pf => pf.PerfilId == perfilId)
                .ToListAsync();

            Dictionary<string, int> permissions = [];

            foreach (PerfilFuncionalidade funcionalidade in funcionalidades)
            {
                // Create the bitmask based on the permissions
                int bitmask = 0;

                if (funcionalidade.AuthVer)
                    bitmask |= 1 << 0; // Set bit 0 (AuthVer)
                if (funcionalidade.AuthAdd)
                    bitmask |= 1 << 1; // Set bit 1 (AuthAdd)
                if (funcionalidade.AuthChg)
                    bitmask |= 1 << 2; // Set bit 2 (AuthChg)
                if (funcionalidade.AuthDel)
                    bitmask |= 1 << 3; // Set bit 3 (AuthDel)
                if (funcionalidade.AuthPrt)
                    bitmask |= 1 << 4; // Set bit 4 (AuthPrt)

                // Add the bitmask for this functionality to the dictionary
                permissions.Add(funcionalidade.FuncionalidadeId.ToString(), bitmask);
            }

            return permissions;
        }
    }
}
