using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Cor", Schema = "Frotas")]
  public class Cor : AuditableEntity
  {
    public string Designacao { get; set; }
  }
}

