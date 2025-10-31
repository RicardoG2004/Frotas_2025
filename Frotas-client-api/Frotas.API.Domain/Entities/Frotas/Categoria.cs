using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Categoria", Schema = "Frotas")]
  public class Categoria : AuditableEntity
  {
    public required string Designacao { get; set; }
  }
}
