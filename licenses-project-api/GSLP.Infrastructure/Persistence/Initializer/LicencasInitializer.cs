using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
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
                // Hospital São João - Clicloud
                new()
                {
                    Id = Guid.Parse("00000001-0001-0000-0001-000000000000"),
                    Nome = "Licença Clicloud - Hospital São João",
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 500,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal de Lisboa - Frotas
                new()
                {
                    Id = Guid.Parse("00000001-0002-0000-0001-000000000000"),
                    Nome = "Licença Frotas - CML",
                    AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 1000,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000002"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                },
                // Grupo Hoteleiro Pestana - Tucloud
                new()
                {
                    Id = Guid.Parse("00000001-0003-0000-0001-000000000000"),
                    Nome = "Licença Tucloud - Grupo Pestana",
                    AplicacaoId = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 300,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000003"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                },
                // Centro Hospitalar do Porto - Clicloud
                new()
                {
                    Id = Guid.Parse("00000001-0004-0000-0001-000000000000"),
                    Nome = "Licença Clicloud - CHP",
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 400,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000004"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal do Porto - Frotas
                new()
                {
                    Id = Guid.Parse("00000001-0005-0000-0001-000000000000"),
                    Nome = "Licença Frotas - CMP",
                    AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 800,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000005"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                },
                // Vila Galé Hotéis - Tucloud
                new()
                {
                    Id = Guid.Parse("00000001-0006-0000-0001-000000000000"),
                    Nome = "Licença Tucloud - Vila Galé",
                    AplicacaoId = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 05, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 05, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 200,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000006"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 05, 00, DateTimeKind.Utc),
                },
                // Hospital da Luz - Clicloud
                new()
                {
                    Id = Guid.Parse("00000001-0007-0000-0001-000000000000"),
                    Nome = "Licença Clicloud - Hospital da Luz",
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 06, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 06, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 600,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000007"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 06, 00, DateTimeKind.Utc),
                },
                // Câmara Municipal de Braga - Frotas
                new()
                {
                    Id = Guid.Parse("00000001-0008-0000-0001-000000000000"),
                    Nome = "Licença Frotas - CMB",
                    AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 07, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 500,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000008"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
                },
                // Hospital de Braga - Clicloud
                new()
                {
                    Id = Guid.Parse("00000001-0009-0000-0001-000000000000"),
                    Nome = "Licença Clicloud - Hospital de Braga",
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 08, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 08, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 450,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000009"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 08, 00, DateTimeKind.Utc),
                },
                // Grupo Luna Hotels & Resorts - Tucloud
                new()
                {
                    Id = Guid.Parse("00000001-0010-0000-0001-000000000000"),
                    Nome = "Licença Tucloud - Grupo Luna",
                    AplicacaoId = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                    DataInicio = new DateTime(2024, 12, 24, 10, 09, 00, DateTimeKind.Utc),
                    DataFim = new DateTime(2025, 12, 24, 10, 09, 00, DateTimeKind.Utc),
                    NumeroUtilizadores = 150,
                    Ativo = true,
                    ClienteId = Guid.Parse("00000001-0000-0000-0000-000000000010"),
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 09, 00, DateTimeKind.Utc),
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
                // Hospital São João - Clicloud
                new()
                {
                    APIKey =
                        "HSJClicloud2024Key+PbaWuooThMePwM4aFc7wxlbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0001-0000-0001-000000000000"),
                },
                // Câmara Municipal de Lisboa - Frotas
                new()
                {
                    APIKey =
                        "CMLFrotas2024Key+ThMePwM4aFc7wxlbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0002-0000-0001-000000000000"),
                },
                // Grupo Hoteleiro Pestana - Tucloud
                new()
                {
                    APIKey = "PestanaTucloud2024Key+4aFc7wxlbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0003-0000-0001-000000000000"),
                },
                // Centro Hospitalar do Porto - Clicloud
                new()
                {
                    APIKey = "CHPClicloud2024Key+7wxlbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0004-0000-0001-000000000000"),
                },
                // Câmara Municipal do Porto - Frotas
                new()
                {
                    APIKey = "CMPFrotas2024Key+lbva9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0005-0000-0001-000000000000"),
                },
                // Vila Galé Hotéis - Tucloud
                new()
                {
                    APIKey = "VGHTucloud2024Key+9lSCLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0006-0000-0001-000000000000"),
                },
                // Hospital da Luz - Clicloud
                new()
                {
                    APIKey = "HDLClicloud2024Key+CLIlta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0007-0000-0001-000000000000"),
                },
                // Câmara Municipal de Braga - Frotas
                new()
                {
                    APIKey = "CMBFrotas2024Key+lta6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0008-0000-0001-000000000000"),
                },
                // Hospital de Braga - Clicloud
                new()
                {
                    APIKey = "HDBClicloud2024Key+6oPRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0009-0000-0001-000000000000"),
                },
                // Grupo Luna Hotels & Resorts - Tucloud
                new()
                {
                    APIKey = "LHRTucloud2024Key+PRYx50tma2kYZQY25tG4A==",
                    Ativo = true,
                    LicencaId = Guid.Parse("00000001-0010-0000-0001-000000000000"),
                },
            ];

            context.LicencasAPIKeys.AddRange(licencasAPIKeys);
        }
    }
}
