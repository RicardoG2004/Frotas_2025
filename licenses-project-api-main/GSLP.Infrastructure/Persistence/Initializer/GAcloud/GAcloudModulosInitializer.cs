using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudModulosInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      Guid gacloudAplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000");

      Modulo[] modulos =
      [
        // Módulos for GAcloud (Autarquias)
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0000-000000000001"),
          Nome = "Base",
          Descricao = "Base",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 12, 42, 18, 110, DateTimeKind.Utc).AddTicks(7504),
          AplicacaoId = gacloudAplicacaoId,
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0000-000000000002"),
          Nome = "Cemitérios",
          Descricao = "Cemitérios",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 15, 27, 09, 151, DateTimeKind.Utc).AddTicks(4739),
          AplicacaoId = gacloudAplicacaoId,
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0000-000000000003"),
          Nome = "Canídeos",
          Descricao = "Canídeos",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 15, 54, 55, 485, DateTimeKind.Utc).AddTicks(7869),
          AplicacaoId = gacloudAplicacaoId,
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0000-000000000004"),
          Nome = "Reports",
          Descricao = "Reports",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 11, 14, 13, 49, 45, 86, DateTimeKind.Utc).AddTicks(9082),
          AplicacaoId = gacloudAplicacaoId,
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0000-000000000005"),
          Nome = "Editor de Texto",
          Descricao = "Editor de Texto",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 19, 10, 0, 0, 0, DateTimeKind.Utc),
          AplicacaoId = gacloudAplicacaoId,
        },
      ];

      // Get existing modulo IDs to avoid duplicates
      List<Guid> existingModuloIds = context.Modulos.Select(m => m.Id).ToList();

      // Only add modulos that don't already exist (by ID)
      List<Modulo> modulosToAdd = modulos.Where(m => !existingModuloIds.Contains(m.Id)).ToList();

      if (modulosToAdd.Count != 0)
      {
        context.Modulos.AddRange(modulosToAdd);
      }
    }
  }
}
