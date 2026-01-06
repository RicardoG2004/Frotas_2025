using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudClientAdminLicencasInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // Câmara Municipal de Braga Admin - admin.cmb@globalsoft.pt (GAcloud)
      ApplicationUser? adminCmb = context.Users.FirstOrDefault(u =>
        u.Email == "admin.cmb@globalsoft.pt"
      );

      if (adminCmb != null && adminCmb.ClienteId.HasValue)
      {
        // CMB License ID (Licença GAcloud - CMB)
        Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");

        // Check if the relationship already exists
        bool relationshipExists = context.LicencasUtilizadores.Any(lu =>
          lu.LicencaId == cmbLicencaId && lu.UtilizadorId == adminCmb.Id
        );

        if (!relationshipExists)
        {
          // Create the LicencaUtilizador relationship for GAcloud client admin
          LicencaUtilizador licencaUtilizador = new()
          {
            LicencaId = cmbLicencaId,
            UtilizadorId = adminCmb.Id,
            Ativo = true, // Admin users should always be active
          };

          context.LicencasUtilizadores.Add(licencaUtilizador);
        }
      }
    }
  }
}
