using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("ManutencaoPeca", Schema = "Frotas")]
  public class ManutencaoPeca : AuditableEntity
  {
    public Guid ManutencaoId { get; set; }
    public Manutencao? Manutencao { get; set; }
    public Guid PecaId { get; set; }
    public Peca? Peca { get; set; }
    public int Quantidade { get; set; }
    public int? Garantia { get; set; }
    public DateTime? Validade { get; set; }
    public decimal ValorSemIva { get; set; }
    public decimal IvaPercentagem { get; set; }
    public decimal ValorTotal { get; set; }
  }
}

