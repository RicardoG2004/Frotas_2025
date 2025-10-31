using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Combustivel", Schema = "Frotas")]
  public class Combustivel : AuditableEntity
  {
    public string Nome { get; set; }
    public decimal PrecoLitro { get; set; }
  }
}
