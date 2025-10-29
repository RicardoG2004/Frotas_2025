using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
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
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000001"),
                    Nome = "Hospital São João",
                    Ativo = true,
                    Sigla = "HSJ",
                    NIF = "501234567",
                    DadosExternos = true,
                    DadosUrl = "https://hsj.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000002"),
                    Nome = "Câmara Municipal de Lisboa",
                    Ativo = true,
                    Sigla = "CML",
                    NIF = "500051070",
                    DadosExternos = true,
                    DadosUrl = "https://lisboa.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000003"),
                    Nome = "Grupo Hoteleiro Pestana",
                    Ativo = true,
                    Sigla = "GHP",
                    NIF = "502980869",
                    DadosExternos = false,
                    DadosUrl = "https://pestana.com/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000004"),
                    Nome = "Centro Hospitalar do Porto",
                    Ativo = true,
                    Sigla = "CHP",
                    NIF = "508331323",
                    DadosExternos = true,
                    DadosUrl = "https://chporto.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000005"),
                    Nome = "Câmara Municipal do Porto",
                    Ativo = true,
                    Sigla = "CMP",
                    NIF = "501306099",
                    DadosExternos = true,
                    DadosUrl = "https://porto.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000006"),
                    Nome = "Vila Galé Hotéis",
                    Ativo = true,
                    Sigla = "VGH",
                    NIF = "508336422",
                    DadosExternos = false,
                    DadosUrl = "https://vilagale.com/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 05, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000007"),
                    Nome = "Hospital da Luz",
                    Ativo = true,
                    Sigla = "HDL",
                    NIF = "507485637",
                    DadosExternos = true,
                    DadosUrl = "https://hospitaldaluz.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 06, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000008"),
                    Nome = "Câmara Municipal de Braga",
                    Ativo = true,
                    Sigla = "CMB",
                    NIF = "506901173",
                    DadosExternos = true,
                    DadosUrl = "https://braga.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 07, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000009"),
                    Nome = "Hospital de Braga",
                    Ativo = true,
                    Sigla = "HDB",
                    NIF = "515545180",
                    DadosExternos = true,
                    DadosUrl = "https://hospitaldebraga.pt/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 08, 00, DateTimeKind.Utc),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000010"),
                    Nome = "Grupo Luna Hotels & Resorts",
                    Ativo = true,
                    Sigla = "LHR",
                    NIF = "500345680",
                    DadosExternos = false,
                    DadosUrl = "https://lunahoteis.com/api",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 09, 00, DateTimeKind.Utc),
                },
            ];

            context.Clientes.AddRange(clientes);
        }
    }
}
