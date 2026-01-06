using GSLP.Infrastructure.Persistence.Contexts;
using GSLP.Infrastructure.Persistence.Initializer;
using GSLP.Infrastructure.Persistence.Initializer.GAcloud;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace GSLP.Infrastructure.Persistence.Extensions
{
  // apply pending migrations, seed database
  public static class DatabaseInitializationExtensions
  {
    public static IServiceCollection AddAndMigrateDatabase<T>(
      this IServiceCollection services,
      IConfiguration configuration
    )
      where T : ApplicationDbContext
    {
      using IServiceScope scope = services.BuildServiceProvider().CreateScope();
      T context = scope.ServiceProvider.GetRequiredService<T>();
      ILogger<T> logger = scope.ServiceProvider.GetRequiredService<ILogger<T>>();

      var maxRetries = 5;
      var retryDelay = TimeSpan.FromSeconds(5);

      for (int i = 0; i < maxRetries; i++)
      {
        try
        {
          logger.LogInformation(
            "Attempting database connection... (Attempt {Attempt}/{MaxAttempts})",
            i + 1,
            maxRetries
          );

          // Test connection
          _ = context.Database.GetPendingMigrations();

          // If we get here, connection successful
          logger.LogInformation("Database connection successful");

          // Apply pending migrations if any
          var pendingMigrations = context.Database.GetPendingMigrations();
          if (pendingMigrations.Any())
          {
            logger.LogInformation($"Found {pendingMigrations.Count()} pending migrations");
            context.Database.Migrate();
            logger.LogInformation("Migrations applied successfully");
          }

          // Check if database is empty (first time setup)
          bool isFirstRun = !context.Modulos.Any() || !context.Funcionalidades.Any();

          if (isFirstRun)
          {
            // First time: seed everything (users, roles, areas, applications, clients, licenses, modulos, funcionalidades, associations)
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("🚀 Initializing Database - First Time Setup");
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            DbInitializer.SeedAdministratorAndRoles(context, logger);
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("✅ Database initialization completed successfully!");
            logger.LogInformation("═══════════════════════════════════════════════════════════");
          }
          else
          {
            // Subsequent runs: only ensure modulos and funcionalidades are up to date for all apps
            // These initializers are idempotent (check for existing items by ID before adding)
            // This allows new modulos/funcionalidades to be added automatically as you develop
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("🔄 Updating Modulos and Funcionalidades");
            logger.LogInformation("═══════════════════════════════════════════════════════════");

            IDbInitializer[] appInitializers = InitializersIndex.GetApplicationInitializers();
            int total = appInitializers.Length;
            int current = 0;

            foreach (IDbInitializer initializer in appInitializers)
            {
              current++;
              string initializerName = initializer.GetType().Name;
              logger.LogInformation(
                "  [{Current}/{Total}] → Running {InitializerName}...",
                current,
                total,
                initializerName
              );
              initializer.Initialize(context);
              logger.LogInformation(
                "  [{Current}/{Total}] ✓ Completed {InitializerName}",
                current,
                total,
                initializerName
              );
            }

            context.SaveChanges();
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("✅ Modulos and Funcionalidades update completed!");
            logger.LogInformation("═══════════════════════════════════════════════════════════");

            // Always ensure critical associations exist (idempotent - only create if missing)
            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("🔗 Ensuring Critical Associations");
            logger.LogInformation("═══════════════════════════════════════════════════════════");

            logger.LogInformation("  → Ensuring GAcloud client admin user exists...");
            new GAcloudClientAdminUserInitializer().Initialize(context);
            context.SaveChanges();
            logger.LogInformation("  ✓ GAcloud client admin user checked");

            logger.LogInformation("  → Ensuring GAcloud client user exists...");
            new GAcloudClientUserInitializer().Initialize(context);
            context.SaveChanges();
            logger.LogInformation("  ✓ GAcloud client user checked");

            logger.LogInformation("  → Ensuring GAcloud profile exists...");
            new GAcloudPerfilInitializer().Initialize(context);
            context.SaveChanges();
            logger.LogInformation("  ✓ GAcloud profile checked");

            logger.LogInformation("  → Ensuring GAcloud user-profile association exists...");
            new GAcloudPerfilUtilizadorInitializer().Initialize(context);
            context.SaveChanges();
            logger.LogInformation("  ✓ GAcloud user-profile association checked");

            logger.LogInformation("  → Ensuring GAcloud client admin license association exists...");
            new GAcloudClientAdminLicencasInitializer().Initialize(context);
            context.SaveChanges();
            logger.LogInformation("  ✓ GAcloud client admin license association checked");

            logger.LogInformation("═══════════════════════════════════════════════════════════");
            logger.LogInformation("✅ Critical associations verified!");
            logger.LogInformation("═══════════════════════════════════════════════════════════");
          }

          return services;
        }
        catch (Exception ex)
        {
          if (i == maxRetries - 1)
          {
            logger.LogError(
              ex,
              "Failed to connect to database after {MaxAttempts} attempts",
              maxRetries
            );
            throw;
          }

          logger.LogWarning(
            ex,
            "Database connection attempt {Attempt} failed. Retrying in {Delay} seconds...",
            i + 1,
            retryDelay.TotalSeconds
          );

          Thread.Sleep(retryDelay);
        }
      }

      return services;
    }
  }
}
