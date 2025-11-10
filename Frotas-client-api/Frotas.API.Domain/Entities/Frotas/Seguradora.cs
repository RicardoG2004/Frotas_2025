using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Seguradora", Schema = "Frotas")]
  public class Seguradora : AuditableEntity
  {
    public string Descricao { get; set; }
  }
}
