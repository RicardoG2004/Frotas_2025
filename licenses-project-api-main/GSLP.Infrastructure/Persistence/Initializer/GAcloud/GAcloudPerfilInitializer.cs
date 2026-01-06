using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudPerfilInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GAcloud CMB License ID
      Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");

      // Profile ID for "Geral" profile
      Guid geralPerfilId = Guid.NewGuid(); // You can use a specific GUID if needed

      // Check if the profile already exists
      bool perfilExists = context.Perfis.Any(p => p.LicencaId == cmbLicencaId && p.Nome == "Geral");

      if (!perfilExists)
      {
        // Create the "Geral" profile for GAcloud CMB license
        Perfil perfil = new()
        {
          Id = geralPerfilId,
          Nome = "Geral",
          Ativo = true,
          LicencaId = cmbLicencaId,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
        };

        context.Perfis.Add(perfil);
        // Save immediately so it can be found by subsequent initializers
        context.SaveChanges();
      }
    }
  }
}
