using Frotas.API.Domain.Common;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Frotas;
using Frotas.API.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

//---------------------------------- CLI COMMANDS --------------------------------------------------

// Set default project to Frotas.API.Infrastructure in Package Manager Console
// When scaffolding database migrations, you must specify which context (ApplicationDbContext), use the following command:

// add-migration -Context ApplicationDbContext -o Persistence/Migrations MigrationName
// update-database -Context ApplicationDbContext

// NOTE: if you use the update-database command, you'll likely see 'No migrations were applied. The database is already up to date' because the migrations are applied programatically during the build.

//--------------------------------------------------------------------------------------------------

namespace Frotas.API.Infrastructure.Persistence.Contexts
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
    public DbSet<Localizacao> Localizacoes { get; set; }
    public DbSet<TaxaIva> TaxasIva { get; set; }
    public DbSet<Setor> Setores { get; set; }
    public DbSet<Conservatoria> Conservatorias { get; set; }
    public DbSet<Delegacao> Delegacoes { get; set; }
    public DbSet<Terceiro> Terceiros { get; set; }
    public DbSet<Entidade> Entidades { get; set; }
    public DbSet<Cor> Cores { get; set; }
    public DbSet<Garantia> Garantias { get; set; }
    public DbSet<Peca> Pecas { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<Marca> Marcas { get; set; }
    public DbSet<Modelo> Modelos { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Combustivel> Combustiveis { get; set; }
    public DbSet<Fornecedor> Fornecedores { get; set; }
    public DbSet<Equipamento> Equipamentos { get; set; }
    public DbSet<TipoViatura> TipoViaturas { get; set; }
    public DbSet<Seguradora> Seguradoras { get; set; }
    public DbSet<Seguro> Seguros { get; set; }
    public DbSet<Viatura> Viaturas { get; set; }
    public DbSet<ViaturaEquipamento> ViaturaEquipamentos { get; set; }
    public DbSet<ViaturaSeguro> ViaturaSeguros { get; set; }
    
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

      modelBuilder.Entity<ViaturaEquipamento>()
        .HasIndex(x => new { x.ViaturaId, x.EquipamentoId })
        .IsUnique();

      modelBuilder.Entity<ViaturaEquipamento>()
        .HasOne(x => x.Viatura)
        .WithMany(x => x.ViaturaEquipamentos)
        .HasForeignKey(x => x.ViaturaId);

      modelBuilder.Entity<ViaturaEquipamento>()
        .HasOne(x => x.Equipamento)
        .WithMany(x => x.ViaturaEquipamentos)
        .HasForeignKey(x => x.EquipamentoId);

      modelBuilder.Entity<ViaturaSeguro>()
        .HasIndex(x => new { x.ViaturaId, x.SeguroId })
        .IsUnique();

      modelBuilder.Entity<ViaturaSeguro>()
        .HasOne(x => x.Viatura)
        .WithMany(x => x.ViaturaSeguros)
        .HasForeignKey(x => x.ViaturaId);

      modelBuilder.Entity<ViaturaSeguro>()
        .HasOne(x => x.Seguro)
        .WithMany(x => x.ViaturaSeguros)
        .HasForeignKey(x => x.SeguroId);

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
