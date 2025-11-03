using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("TaxaIva", Schema = "Base")]
  public class TaxaIva : AuditableEntity
  {
    public decimal Valor { get; set; }
    public string Descricao { get; set; }
    public bool Ativo { get; set; }
  }
}