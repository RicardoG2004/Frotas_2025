using GSLP.Infrastructure.Persistence.Contexts;
using GSLP.Infrastructure.Persistence.Initializer;
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
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<T>>();

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
                    context.Database.GetPendingMigrations();

                    // If we get here, connection successful
                    logger.LogInformation("Database connection successful");

                    // Continue with your existing migration logic
                    var pendingMigrations = context.Database.GetPendingMigrations();
                    if (pendingMigrations.Any())
                    {
                        logger.LogInformation(
                            $"Found {pendingMigrations.Count()} pending migrations"
                        );
                        context.Database.Migrate();
                        logger.LogInformation("Migrations applied successfully");

                        if (!context.Areas.Any())
                        {
                            logger.LogInformation("Seeding initial data...");
                            DbInitializer.SeedAdministratorAndRoles(context);
                        }
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
