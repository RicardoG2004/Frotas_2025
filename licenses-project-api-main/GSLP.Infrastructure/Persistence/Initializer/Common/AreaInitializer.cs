using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.Common
{
  public class AreaInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      Area[] areas =
      [
        new()
        {
          Id = Guid.Parse("49b0eea1-673c-4db7-883a-45f50a82c1e6"),
          Nome = "Gestão Interna",
          Color = "#facc15",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
        },
        new()
        {
          Id = Guid.Parse("7c421340-d0d3-45c9-b9c0-d6c9b0e36a5b"),
          Nome = "Saúde",
          Color = "#4ade80",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),

          CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
        },
        new()
        {
          Id = Guid.Parse("9e5c9f4a-3a1d-4c93-b2f8-4c8d59e8c5a1"),
          Nome = "Autarquias",
          Color = "#60a5fa",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
        },
        new()
        {
          Id = Guid.Parse("d2f1c5b8-8e4a-4b7c-9e3d-1d8b6f1c2a3b"),
          Nome = "Empresarial",
          Color = "#a78bfa",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
        },
        new()
        {
          Id = Guid.Parse("f7e9c6d5-b4a3-4c2b-8d1e-9a7b6f5c4d3e"),
          Nome = "Turismo",
          Color = "#f472b6",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
        },
      ];

      context.Areas.AddRange(areas);
    }
  }
}
