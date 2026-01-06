using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudPerfilFuncionalidadesInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GAcloud CMB License ID
      Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");

      // GAcloud Application ID
      Guid gacloudAplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000");

      // Find the "Geral" profile for CMB license
      Perfil? geralPerfil = context.Perfis.FirstOrDefault(p =>
        p.LicencaId == cmbLicencaId && p.Nome == "Geral"
      );

      if (geralPerfil == null)
      {
        // Profile doesn't exist yet, skip (it should be created by GAcloudPerfilInitializer first)
        return;
      }

      // Get all GAcloud funcionalidades (by checking their Modulo's AplicacaoId)
      List<Guid> gacloudFuncionalidadeIds = context
        .Funcionalidades.Include(f => f.Modulo)
        .Where(f => f.Modulo.AplicacaoId == gacloudAplicacaoId && f.Ativo)
        .Select(f => f.Id)
        .ToList();

      if (gacloudFuncionalidadeIds.Count == 0)
      {
        // No GAcloud funcionalidades found, skip
        return;
      }

      // Get existing PerfilFuncionalidade relationships for this profile
      List<Guid> existingFuncionalidadeIds = context
        .PerfisFuncionalidades.Where(pf => pf.PerfilId == geralPerfil.Id)
        .Select(pf => pf.FuncionalidadeId)
        .ToList();

      // Create PerfilFuncionalidade relationships for all GAcloud funcionalidades
      foreach (Guid funcionalidadeId in gacloudFuncionalidadeIds)
      {
        // Skip if relationship already exists
        if (existingFuncionalidadeIds.Contains(funcionalidadeId))
        {
          continue;
        }

        PerfilFuncionalidade perfilFuncionalidade = new()
        {
          PerfilId = geralPerfil.Id,
          FuncionalidadeId = funcionalidadeId,
          AuthVer = true, // Default permissions - all enabled
          AuthAdd = true,
          AuthChg = true,
          AuthDel = true,
          AuthPrt = true,
        };

        context.PerfisFuncionalidades.Add(perfilFuncionalidade);
      }
    }
  }
}
