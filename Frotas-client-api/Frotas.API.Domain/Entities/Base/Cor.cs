using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Cor", Schema = "Base")]
  public class Cor : AuditableEntity
  {
    public string Designacao { get; set; }
  }
}
