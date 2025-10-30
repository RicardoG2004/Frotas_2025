using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Marca", Schema = "Frotas")]
  public class Marca : AuditableEntity
  {
    public string Nome { get; set; }
  }
}
