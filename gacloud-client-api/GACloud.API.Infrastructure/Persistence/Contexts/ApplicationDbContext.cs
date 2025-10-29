using GACloud.API.Domain.Common;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Frotas;
using GACloud.API.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

//---------------------------------- CLI COMMANDS --------------------------------------------------

// Set default project to GACloud.API.Infrastructure in Package Manager Console
// When scaffolding database migrations, you must specify which context (ApplicationDbContext), use the following command:

// add-migration -Context ApplicationDbContext -o Persistence/Migrations MigrationName
// update-database -Context ApplicationDbContext

// NOTE: if you use the update-database command, you'll likely see 'No migrations were applied. The database is already up to date' because the migrations are applied programatically during the build.

//--------------------------------------------------------------------------------------------------

namespace GACloud.API.Infrastructure.Persistence.Contexts
{
  public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
  {
    public string CurrentUserId { get; set; }

    public void SetCurrentUserId(string userId)
    {
      CurrentUserId = userId;
    }

    // DbSets
    public DbSet<Pais> Paises { get; set; }
    public DbSet<CodigoPostal> CodigosPostais { get; set; }
    public DbSet<Distrito> Distritos { get; set; }
    public DbSet<Concelho> Concelhos { get; set; }
    public DbSet<Freguesia> Freguesias { get; set; }
    public DbSet<Rua> Ruas { get; set; }
    public DbSet<Entidade> Entidades { get; set; }
    public DbSet<EntidadeContacto> EntidadeContactos { get; set; }
    public DbSet<Epoca> Epocas { get; set; }
    public DbSet<Rubrica> Rubricas { get; set; }
    public DbSet<AgenciaFuneraria> AgenciasFunerarias { get; set; }
    public DbSet<Coveiro> Coveiros { get; set; }
    public DbSet<Marca> Marcas { get; set; }
  

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Disable cascade delete globally
      foreach (
        var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys())
      )
      {
        relationship.DeleteBehavior = DeleteBehavior.NoAction;
      }

      // query filters
      _ = modelBuilder.AppendGlobalQueryFilter<ISoftDelete>(s => s.DeletedOn == null);


      modelBuilder.SeedStaticData();
    }

    public override async Task<int> SaveChangesAsync(
      CancellationToken cancellationToken = new CancellationToken()
    )
    {
      this.AuditFields(CurrentUserId);
      int result = await base.SaveChangesAsync(cancellationToken);
      return result;
    }
  }
}
