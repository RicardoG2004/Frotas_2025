using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Manutencao", Schema = "Frotas")]
  public class Manutencao : AuditableEntity
  {
    public DateTime DataRequisicao { get; set; }
    public Guid FseId { get; set; }
    public Fse Fse { get; set; }
    public Guid FuncionarioId { get; set; }
    public Funcionario Funcionario { get; set; }
    public DateTime DataEntrada { get; set; }
    public string HoraEntrada { get; set; }
    public DateTime DataSaida { get; set; }
    public string HoraSaida { get; set; }
    public Guid ViaturaId { get; set; }
    public Viatura Viatura { get; set; }
    public int KmsRegistados { get; set; }
    public decimal TotalSemIva { get; set; }
    public decimal ValorIva { get; set; }
    public decimal Total { get; set; }
    public ICollection<ManutencaoServico> ManutencaoServicos { get; set; } = new List<ManutencaoServico>();
  }
}