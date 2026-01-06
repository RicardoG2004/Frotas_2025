using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudPerfilUtilizadorInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GAcloud Client User - cliente.cmb@globalsoft.pt
      string clientUserId = "7cdab3df-8ce5-43a2-91b9-b607d687ab92";

      // GAcloud CMB License ID
      Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");

      // Find the "Geral" profile for CMB license
      Perfil? geralPerfil = context.Perfis.FirstOrDefault(p =>
        p.LicencaId == cmbLicencaId && p.Nome == "Geral"
      );

      if (geralPerfil == null)
      {
        // Profile doesn't exist yet, skip (it should be created by GAcloudPerfilInitializer first)
        return;
      }

      // Check if user exists
      bool userExists = context.Users.Any(u => u.Id == clientUserId);
      if (!userExists)
      {
        // User doesn't exist yet, skip (it should be created by GAcloudClientUserInitializer first)
        return;
      }

      // Check if PerfilUtilizador relationship already exists
      bool relationshipExists = context.PerfisUtilizadores.Any(pu =>
        pu.PerfilId == geralPerfil.Id && pu.UtilizadorId == clientUserId
      );

      if (!relationshipExists)
      {
        // Create the PerfilUtilizador relationship
        PerfilUtilizador perfilUtilizador = new()
        {
          PerfilId = geralPerfil.Id,
          UtilizadorId = clientUserId,
        };

        context.PerfisUtilizadores.Add(perfilUtilizador);
      }
    }
  }
}
