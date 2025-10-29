using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GACloud.API.Infrastructure.Persistence.Configurations
{
  public class SepulturaConfiguration : IEntityTypeConfiguration<Sepultura>
  {
    public void Configure(EntityTypeBuilder<Sepultura> builder)
    {
      builder
        .HasOne(s => s.Talhao)
        .WithMany()
        .HasForeignKey(s => s.TalhaoId)
        .OnDelete(DeleteBehavior.NoAction)
        .IsRequired();

      builder
        .HasOne(s => s.SepulturaTipo)
        .WithMany()
        .HasForeignKey(s => s.SepulturaTipoId)
        .OnDelete(DeleteBehavior.NoAction)
        .IsRequired();

      // builder
      //   .HasOne(s => s.CemiterioSepulturaEstado)
      //   .WithMany()
      //   .HasForeignKey(s => s.CemiterioSepulturaEstadoId)
      //   .OnDelete(DeleteBehavior.NoAction)
      //   .IsRequired();

      // builder
      //   .HasOne(s => s.CemiterioSepulturaSituacao)
      //   .WithMany()
      //   .HasForeignKey(s => s.CemiterioSepulturaSituacaoId)
      //   .OnDelete(DeleteBehavior.NoAction)
      //   .IsRequired();
    }
  }
}
