using Frotas.API.Infrastructure.Persistence.Contexts;
using Frotas.API.Infrastructure.Persistence.Initializer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frotas.API.Infrastructure.Persistence.Extensions
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
      // apply migrations to DB
      using IServiceScope scopeBase = services.BuildServiceProvider().CreateScope();
      T applicationDbContext = scopeBase.ServiceProvider.GetRequiredService<T>();
      
      // Check for pending migrations and apply them
      var pendingMigrations = applicationDbContext.Database.GetPendingMigrations().ToList();
      if (pendingMigrations.Any())
      {
        applicationDbContext.Database.Migrate(); // apply any pending migrations
      }
      
      // Verify and apply migration for Utilizacao fields if needed
      // This handles the case where migration is registered but columns don't exist
      try
      {
        var connectionString = applicationDbContext.Database.GetConnectionString();
        using var connection = new SqlConnection(connectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = @"
          IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Frotas].[Utilizacao]') AND name = 'ValorCombustivel')
          BEGIN
            ALTER TABLE [Frotas].[Utilizacao] ADD [ValorCombustivel] decimal(18,2) NULL;
            ALTER TABLE [Frotas].[Utilizacao] ADD [KmPartida] decimal(18,2) NULL;
            ALTER TABLE [Frotas].[Utilizacao] ADD [KmChegada] decimal(18,2) NULL;
            ALTER TABLE [Frotas].[Utilizacao] ADD [TotalKmEfectuados] decimal(18,2) NULL;
            ALTER TABLE [Frotas].[Utilizacao] ADD [TotalKmConferidos] decimal(18,2) NULL;
            ALTER TABLE [Frotas].[Utilizacao] ADD [TotalKmAConferir] decimal(18,2) NULL;
          END
        ";
        command.ExecuteNonQuery();
        connection.Close();
      }
      catch
      {
        // If columns already exist or error occurs, continue
      }
      
      DbInitializer.SeedAdminAndRoles(applicationDbContext);

      return services;
    }
  }
}
