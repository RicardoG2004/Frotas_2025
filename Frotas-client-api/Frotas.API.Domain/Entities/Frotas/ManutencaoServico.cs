using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("ManutencaoServico", Schema = "Frotas")]
  public class ManutencaoServico : AuditableEntity
  {
    public Guid ManutencaoId { get; set; }
    public Manutencao? Manutencao { get; set; }
    public Guid ServicoId { get; set; }
    public Servico? Servico { get; set; }
    public int Quantidade { get; set; }
    public int? KmProxima { get; set; }
    public DateTime? DataProxima { get; set; }
    public decimal ValorSemIva { get; set; }
    public decimal IvaPercentagem { get; set; }
    public decimal ValorTotal { get; set; }
  }
}
