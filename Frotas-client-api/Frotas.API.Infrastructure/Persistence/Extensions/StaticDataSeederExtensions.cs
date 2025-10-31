using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Infrastructure.Persistence.Extensions
{
  public static class StaticDataSeederExtensions
  {
    public static void SeedStaticData(this ModelBuilder builder) // create methods here for model seed data (static data) -- this data will be managed by EF migrations
    {
      // Seed Combustíveis
      var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
      builder.Entity<Combustivel>().HasData(
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Nome = "Gasolina 95", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Nome = "Gasolina 98", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000003"), Nome = "Gasolina E10", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000004"), Nome = "E85", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000005"), Nome = "Gasóleo Simples", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000006"), Nome = "Gasóleo Aditivado", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000007"), Nome = "Biodiesel", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000008"), Nome = "GPL/Autogás", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-000000000009"), Nome = "GNV/Gás Natural Veicular", CreatedBy = Guid.Empty, CreatedOn = seedDate },
        new Combustivel() { Id = Guid.Parse("00000000-0000-0000-0000-00000000000A"), Nome = "ADBlue", CreatedBy = Guid.Empty, CreatedOn = seedDate }
      );
    }
  }
}
