using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.Common
{
  public class LicencasInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      Licenca[] licencas =
      [
        // Globalsoft Licenca API
        new()
        {
          Id = Guid.Parse("e2718081-b7b7-462f-b49e-9cb0b2af0dde"),
          Nome = "Licenca API - Globalsoft - CBSC, SA",
          AplicacaoId = Guid.Parse("00000001-0000-0000-0000-000000000000"),
          DataInicio = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
          DataFim = new DateTime(2025, 12, 24, 10, 00, 00, DateTimeKind.Utc),
          NumeroUtilizadores = 10,
          Ativo = true,
          ClienteId = Guid.Parse("ebe3f722-2d0c-4d87-8da3-be9c5b0dc6ca"),
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
        },
        // Câmara Municipal de Braga - GAcloud
        new()
        {
          Id = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237"),
          Nome = "Licença GAcloud - CMB",
          AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
          DataInicio = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
          DataFim = new DateTime(2025, 12, 24, 10, 07, 00, DateTimeKind.Utc),
          NumeroUtilizadores = 500,
          Ativo = true,
          ClienteId = Guid.Parse("915220DC-CA91-4537-1763-08DE33F7F2C2"),
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
        },
        // Licenca Updater - Globalsoft - CBSC, SA
        new()
        {
          Id = Guid.Parse("b221e0e6-00b4-4c3f-75d1-08de2c15bbeb"),
          Nome = "Licenca Updater - Globalsoft - CBSC, SA",
          AplicacaoId = Guid.Parse("00000006-0000-0000-0000-000000000000"),
          DataInicio = new DateTime(2025, 11, 01, 00, 00, 00, DateTimeKind.Utc),
          DataFim = new DateTime(2035, 11, 01, 00, 00, 00, DateTimeKind.Utc),
          NumeroUtilizadores = 1,
          Ativo = true,
          Bloqueada = false,
          ClienteId = Guid.Parse("ebe3f722-2d0c-4d87-8da3-be9c5b0dc6ca"),
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 11, 25, 11, 28, 19, DateTimeKind.Utc),
        },
      ];

      context.Licencas.AddRange(licencas);

      LicencaAPIKey[] licencasAPIKeys =
      [
        // Globalsoft Licenca API
        new()
        {
          APIKey =
            "m98elJqm0pTtpHcw2+3DfPLRxaGLyPbaWuooThMePwM4aFc7wxlbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
          Ativo = true,
          LicencaId = Guid.Parse("e2718081-b7b7-462f-b49e-9cb0b2af0dde"),
        },
        // Câmara Municipal de Braga - GAcloud
        new()
        {
          APIKey = "CMBGAcloud2024Key+lta6oPRYx50tma2kYZQY25tG4A==",
          Ativo = true,
          LicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237"),
        },
        // Licenca Updater - Globalsoft - CBSC, SA
        new()
        {
          Id = Guid.Parse("ca6531c1-0a23-405c-0dba-08de2c15c7ec"),
          APIKey =
            "G124sZBXau8exfkSrW2D+to2/NQn+l0EniBUekFvdVrMQ++yes9qS4qQ/7bWJgGRHA45h6/bGPXqphAzLLvYWA==",
          Ativo = true,
          LicencaId = Guid.Parse("b221e0e6-00b4-4c3f-75d1-08de2c15bbeb"),
        },
      ];

      context.LicencasAPIKeys.AddRange(licencasAPIKeys);
    }
  }
}
