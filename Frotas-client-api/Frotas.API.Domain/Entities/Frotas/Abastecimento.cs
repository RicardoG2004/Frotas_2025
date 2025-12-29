using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Abastecimento", Schema = "Frotas")]
  public class Abastecimento : AuditableEntity
  {
    public DateTime Data { get; set; }
    public Guid FuncionarioId { get; set; }
    public Funcionario Funcionario { get; set; }
    public Guid ViaturaId { get; set; }
    public Viatura Viatura { get; set; }
    public decimal? Kms { get; set; }
    public decimal? Litros { get; set; }
    public decimal? Valor { get; set; }
  }
}

