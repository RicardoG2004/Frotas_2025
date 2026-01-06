using GSLP.Infrastructure.Persistence.Contexts;
using GSLP.Infrastructure.Persistence.Initializer.Common;
using GSLP.Infrastructure.Persistence.Initializer.GAcloud;
using GSLP.Infrastructure.Persistence.Initializer.GSLPManager;
using Microsoft.Extensions.Logging;

namespace GSLP.Infrastructure.Persistence.Initializer
{
  public static class DbInitializer
  {
    public static void SeedAdministratorAndRoles(
      ApplicationDbContext context,
      ILogger? logger = null
    )
    {
      ArgumentNullException.ThrowIfNull(context, nameof(context));

      IDbInitializer[] initializers =
      [
        new UserRoleInitializer(),
        new AreaInitializer(),
        new AplicacaoInitializer(),
        // Application-specific initializers (from index) - modulos and funcionalidades
        // These are run separately on every app start, not just on first DB creation
        .. InitializersIndex.GetApplicationInitializers(),
        new ClientesInitializer(),
        new LicencasInitializer(),
        new GSLPManagerAdministratorLicencaInitializer(),
        new GAcloudClientAdminUserInitializer(), // GAcloud admin user - needs to be saved before license association
        new GAcloudClientAdminLicencasInitializer(),
        new GAcloudPerfilInitializer(), // Profile saves immediately inside
        new GAcloudClientUserInitializer(), // User needs to be saved before association
        new GAcloudLicencaModulosInitializer(),
        new GAcloudLicencaFuncionalidadesInitializer(),
        new GAcloudPerfilFuncionalidadesInitializer(),
        new GAcloudPerfilUtilizadorInitializer(), // Needs user and profile to be saved first
      ];

      int total = initializers.Length;
      int current = 0;

      foreach (IDbInitializer initializer in initializers)
      {
        current++;
        string initializerName = initializer.GetType().Name;
        logger?.LogInformation(
          "  [{Current}/{Total}] → Running {InitializerName}...",
          current,
          total,
          initializerName
        );
        initializer.Initialize(context);
        logger?.LogInformation(
          "  [{Current}/{Total}] ✓ Completed {InitializerName}",
          current,
          total,
          initializerName
        );

        // Save after user initializers so they can be found by association initializers
        if (initializer is GAcloudClientAdminUserInitializer or GAcloudClientUserInitializer)
        {
          logger?.LogInformation("  💾 Saving user changes...");
          _ = context.SaveChanges();
          logger?.LogInformation("  ✓ User changes saved");
        }
      }

      logger?.LogInformation("  💾 Saving all remaining changes to database...");
      _ = context.SaveChanges();
      logger?.LogInformation("  ✓ All changes saved successfully");
    }
  }
}
