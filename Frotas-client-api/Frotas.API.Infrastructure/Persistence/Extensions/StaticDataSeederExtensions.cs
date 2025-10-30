using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Infrastructure.Persistence.Extensions
{
  public static class StaticDataSeederExtensions
  {
    public static void SeedStaticData(this ModelBuilder builder) // create methods here for model seed data (static data) -- this data will be managed by EF migrations
    {
      //// for example

      //builder.Entity<ProductType>().HasData(
      //    new ProductType() { Id = 1, Name = "typeA" },
      //    new ProductType() { Id = 2, Name = "typeB" },
      //    new ProductType() { Id = 3, Name = "typeC" }
      //    );
    }
  }
}
