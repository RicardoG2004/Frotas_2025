using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.Common
{
  public class ClientesInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      Cliente[] clientes =
      [
        // Globalsoft
        new()
        {
          Id = Guid.Parse("ebe3f722-2d0c-4d87-8da3-be9c5b0dc6ca"),
          Nome = "Globalsoft - Cloud Business and Software Consulting, SA",
          Ativo = true,
          Sigla = "gscbsc",
          NIF = "502501824",
          DadosExternos = false,
          DadosUrl = "https://globalsoft.pt/gslp",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
        },
        new()
        {
          Id = Guid.Parse("915220DC-CA91-4537-1763-08DE33F7F2C2"),
          Nome = "Câmara Municipal de Braga",
          Ativo = true,
          Sigla = "CMB",
          NIF = "506901173",
          DadosExternos = true,
          DadosUrl = "https://braga.pt/api",
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
        },
      ];

      context.Clientes.AddRange(clientes);
    }
  }
}
