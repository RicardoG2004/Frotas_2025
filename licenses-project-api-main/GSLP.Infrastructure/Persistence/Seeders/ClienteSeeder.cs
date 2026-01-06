using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Infrastructure.Persistence.Seeders
{
    public static class ClienteSeeder
    {
        public static List<Cliente> GetClientes()
        {
            return
            [
                new Cliente
                {
                    Id = Guid.Parse("f2a1c8b7-c9d1-4c5b-b3e6-8a3b4c1b9d0b"),
                    Nome = "Cliente A",
                    Ativo = true,
                    Sigla = "CA",
                    NIF = "123456789",
                    DadosExternos = true,
                    DadosUrl = "https://example.com/data-a",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 31, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("ab3b743e-bc4d-44c2-bf72-402c44e2f0f9"),
                    Nome = "Cliente B",
                    Ativo = true,
                    Sigla = "CB",
                    NIF = "987654321",
                    DadosExternos = false,
                    DadosUrl = "https://example.com/data-b",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("dab2a531-e6f4-42bc-8d23-58598389be2e"),
                    Nome = "Cliente C",
                    Ativo = true,
                    Sigla = "CC",
                    NIF = "112233445",
                    DadosExternos = true,
                    DadosUrl = "https://example.com/data-c",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("56d39be0-d912-48f6-9096-3cfcc8aef1c2"),
                    Nome = "Cliente D",
                    Ativo = false,
                    Sigla = "CD",
                    NIF = "556677889",
                    DadosExternos = false,
                    DadosUrl = "https://example.com/data-d",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 34, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("75a3e378-1f5f-41bb-b470-f6939709a6e9"),
                    Nome = "Cliente E",
                    Ativo = true,
                    Sigla = "CE",
                    NIF = "998877665",
                    DadosExternos = true,
                    DadosUrl = "https://example.com/data-e",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 35, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("3c1e827d-c2b1-4c3f-8ed4-5b9618be877d"),
                    Nome = "Cliente F",
                    Ativo = true,
                    Sigla = "CF",
                    NIF = "123123123",
                    DadosExternos = false,
                    DadosUrl = "https://example.com/data-f",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 36, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("5597b3c1-b99b-4a0d-a08d-8cda3c7b4a5e"),
                    Nome = "Cliente G",
                    Ativo = false,
                    Sigla = "CG",
                    NIF = "321321321",
                    DadosExternos = true,
                    DadosUrl = "https://example.com/data-g",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 37, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("db1bc2a4-383d-40db-9c66-e6e45c73b26d"),
                    Nome = "Cliente H",
                    Ativo = true,
                    Sigla = "CH",
                    NIF = "654654654",
                    DadosExternos = false,
                    DadosUrl = "https://example.com/data-h",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 38, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("9b2c40ac-bc2d-4f9e-8a4a-1bc1e9831b3a"),
                    Nome = "Cliente I",
                    Ativo = true,
                    Sigla = "CI",
                    NIF = "1123581321",
                    DadosExternos = true,
                    DadosUrl = "https://example.com/data-i",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 39, 18, DateTimeKind.Utc),
                },
                new Cliente
                {
                    Id = Guid.Parse("6f6e13c3-b4ca-4526-99f6-1ecfe56ab436"),
                    Nome = "Cliente J",
                    Ativo = false,
                    Sigla = "CJ",
                    NIF = "987654123",
                    DadosExternos = false,
                    DadosUrl = "https://example.com/data-j",
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 40, 18, DateTimeKind.Utc),
                },
            ];
        }
    }
}
