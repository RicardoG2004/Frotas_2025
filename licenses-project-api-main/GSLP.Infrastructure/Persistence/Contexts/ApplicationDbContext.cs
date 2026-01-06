using GSLP.Application.Common;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Persistence.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

//---------------------------------- CLI COMMANDS --------------------------------------------------

// Set default project to GSLP.Infrastructure in Package Manager Console
// When scaffolding database migrations, you must specify which context (ApplicationDbContext), use the following command:

// add-migration -Context ApplicationDbContext -o Persistence/Migrations MigrationName
// update-database -Context ApplicationDbContext

// NOTE: if you use the update-database command, you'll likely see 'No migrations were applied. The database is already up to date' because the migrations are applied programatically during the build.

//--------------------------------------------------------------------------------------------------

namespace GSLP.Infrastructure.Persistence.Contexts
{
    public class ApplicationRoles : IdentityRole { }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser> // main context class -- migrations are run using this context
    {
        public string CurrentUserId { get; set; }
        private readonly ICurrentTenantUserService _currentTenantService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) // default constructor for IDesignTimeDbContextFactory
        { }

        public ApplicationDbContext(
            ICurrentTenantUserService currentTenantUserService,
            DbContextOptions<ApplicationDbContext> options
        )
            : base(options)
        {
            _currentTenantService = currentTenantUserService;
        }

        // This method will be called by a scoped service or middleware
        public void SetCurrentUserId(string userId)
        {
            CurrentUserId = userId;
        }

        // -- add DbSets here for new application entities
        public DbSet<Area> Areas { get; set; }
        public DbSet<Aplicacao> Aplicacoes { get; set; }
        public DbSet<Modulo> Modulos { get; set; }
        public DbSet<Funcionalidade> Funcionalidades { get; set; }
        public DbSet<Licenca> Licencas { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<PerfilFuncionalidade> PerfisFuncionalidades { get; set; }
        public DbSet<PerfilUtilizador> PerfisUtilizadores { get; set; }
        public DbSet<LicencaAPIKey> LicencasAPIKeys { get; set; }
        public DbSet<LicencaModulo> LicencasModulos { get; set; }
        public DbSet<LicencaFuncionalidade> LicencasFuncionalidades { get; set; }
        public DbSet<LicencaUtilizador> LicencasUtilizadores { get; set; }
        public DbSet<AppUpdate> AppUpdates { get; set; }
        public DbSet<AppUpdateCliente> AppUpdatesClientes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // PerfilFuncionalidade configuration
            _ = builder
                .Entity<PerfilFuncionalidade>()
                .HasKey(pf => new { pf.PerfilId, pf.FuncionalidadeId });

            _ = builder
                .Entity<PerfilFuncionalidade>()
                .HasOne(pf => pf.Perfil)
                .WithMany(p => p.PerfisFuncionalidades)
                .HasForeignKey(pf => pf.PerfilId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<PerfilFuncionalidade>()
                .HasOne(pf => pf.Funcionalidade)
                .WithMany(f => f.PerfisFuncionalidades)
                .HasForeignKey(pf => pf.FuncionalidadeId)
                .OnDelete(DeleteBehavior.Restrict);

            // LicencaFuncionalidade configuration
            _ = builder
                .Entity<LicencaFuncionalidade>()
                .HasKey(lf => new { lf.LicencaId, lf.FuncionalidadeId });

            _ = builder
                .Entity<LicencaFuncionalidade>()
                .HasOne(lf => lf.Licenca)
                .WithMany(l => l.LicencasFuncionalidades)
                .HasForeignKey(lf => lf.LicencaId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<LicencaFuncionalidade>()
                .HasOne(lf => lf.Funcionalidade)
                .WithMany(f => f.LicencasFuncionalidades)
                .HasForeignKey(lf => lf.FuncionalidadeId)
                .OnDelete(DeleteBehavior.Restrict);

            // LicencaUtilizador configuration
            _ = builder
                .Entity<LicencaUtilizador>()
                .HasKey(lu => new { lu.LicencaId, lu.UtilizadorId });

            _ = builder
                .Entity<LicencaUtilizador>()
                .HasQueryFilter(lu => lu.Utilizador.DeletedOn == null);

            _ = builder
                .Entity<LicencaUtilizador>()
                .HasOne(lu => lu.Licenca)
                .WithMany(l => l.LicencasUtilizadores)
                .HasForeignKey(lu => lu.LicencaId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<LicencaUtilizador>()
                .HasOne(lu => lu.Utilizador)
                .WithMany(u => u.LicencasUtilizadores)
                .HasForeignKey(lu => lu.UtilizadorId)
                .OnDelete(DeleteBehavior.Restrict);

            // LicencaModulo configuration
            _ = builder.Entity<LicencaModulo>().HasKey(lm => new { lm.LicencaId, lm.ModuloId });

            _ = builder
                .Entity<LicencaModulo>()
                .HasOne(lm => lm.Licenca)
                .WithMany(l => l.LicencasModulos)
                .HasForeignKey(lm => lm.LicencaId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<LicencaModulo>()
                .HasOne(lm => lm.Modulo)
                .WithMany(m => m.LicencasModulos)
                .HasForeignKey(lm => lm.ModuloId)
                .OnDelete(DeleteBehavior.Restrict);

            // PerfilUtilizador configuration
            _ = builder
                .Entity<PerfilUtilizador>()
                .HasKey(pu => new { pu.PerfilId, pu.UtilizadorId });

            _ = builder
                .Entity<PerfilUtilizador>()
                .HasQueryFilter(pu => pu.Utilizador.DeletedOn == null);

            _ = builder
                .Entity<PerfilUtilizador>()
                .HasOne(pu => pu.Perfil)
                .WithMany(p => p.PerfisUtilizadores)
                .HasForeignKey(pu => pu.PerfilId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<PerfilUtilizador>()
                .HasOne(pu => pu.Utilizador)
                .WithMany(u => u.PerfisUtilizadores)
                .HasForeignKey(pu => pu.UtilizadorId)
                .OnDelete(DeleteBehavior.Restrict);

            // LicencaAPIKey configuration
            _ = builder
                .Entity<LicencaAPIKey>()
                .HasOne(a => a.Licenca)
                .WithOne(l => l.LicencaAPIKey)
                .HasForeignKey<LicencaAPIKey>(a => a.LicencaId)
                .OnDelete(DeleteBehavior.Restrict);

            // AppUpdate configuration
            _ = builder
                .Entity<AppUpdate>()
                .HasOne(au => au.Aplicacao)
                .WithMany()
                .HasForeignKey(au => au.AplicacaoId)
                .OnDelete(DeleteBehavior.Restrict);

            _ = builder
                .Entity<AppUpdate>()
                .Property(au => au.TipoUpdate)
                .HasConversion<int>(); // Store enum as int in database

            // AppUpdateCliente configuration
            _ = builder
                .Entity<AppUpdateCliente>()
                .HasKey(auc => new { auc.AppUpdateId, auc.ClienteId });

            _ = builder
                .Entity<AppUpdateCliente>()
                .HasOne(auc => auc.AppUpdate)
                .WithMany(au => au.AppUpdatesClientes)
                .HasForeignKey(auc => auc.AppUpdateId)
                .OnDelete(DeleteBehavior.Cascade);

            _ = builder
                .Entity<AppUpdateCliente>()
                .HasOne(auc => auc.Cliente)
                .WithMany()
                .HasForeignKey(auc => auc.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Licenca configuration
            _ = builder
                .Entity<Licenca>()
                .Property(l => l.UseOwnUpdater)
                .HasDefaultValue(false);

            // rename identity tables
            builder.ApplyIdentityConfiguration();

            // query filters
            _ = builder.AppendGlobalQueryFilter<ISoftDelete>(s => s.DeletedOn == null); // filter out deleted entities (soft delete)

            builder.SeedStaticData();
        }

        public override async Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = new CancellationToken()
        ) // handle audit fields (createdOn, createdBy, modifiedBy, modifiedOn) and handle soft delete on save changes
        {
            this.AuditFields(CurrentUserId);
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
