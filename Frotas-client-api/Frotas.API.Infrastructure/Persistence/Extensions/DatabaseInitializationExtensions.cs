using Frotas.API.Infrastructure.Persistence.Contexts;
using Frotas.API.Infrastructure.Persistence.Initializer;
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
      if (applicationDbContext.Database.GetPendingMigrations().Any())
      {
        applicationDbContext.Database.Migrate(); // apply any pending migrations
      }
      DbInitializer.SeedAdminAndRoles(applicationDbContext);

      return services;
    }
  }
}
