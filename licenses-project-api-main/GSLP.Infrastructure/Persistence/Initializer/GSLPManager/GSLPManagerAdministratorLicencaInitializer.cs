using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GSLPManager
{
  public class GSLPManagerAdministratorLicencaInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GSLP Manager Administrator user ID
      string administratorUserId = "1b77edb4-ae80-46b5-a388-d033eeddac1d";

      // Globalsoft license ID (Licenca API - Globalsoft - CBSC, SA) - GSLP Manager
      Guid globalsoftLicencaId = Guid.Parse("e2718081-b7b7-462f-b49e-9cb0b2af0dde");

      // Check if the relationship already exists
      bool relationshipExists = context.LicencasUtilizadores.Any(lu =>
        lu.LicencaId == globalsoftLicencaId && lu.UtilizadorId == administratorUserId
      );

      if (!relationshipExists)
      {
        // Create the LicencaUtilizador relationship for GSLP Manager administrator
        LicencaUtilizador licencaUtilizador = new()
        {
          LicencaId = globalsoftLicencaId,
          UtilizadorId = administratorUserId,
          Ativo = true, // Administrator should always be active
        };

        context.LicencasUtilizadores.Add(licencaUtilizador);
      }
    }
  }
}
