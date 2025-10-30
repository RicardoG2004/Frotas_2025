using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Freguesia", Schema = "Base")]
  public class Freguesia : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid ConcelhoId { get; set; }
    public Concelho Concelho { get; set; }
    public ICollection<Rua> Ruas { get; set; } = [];
  }
}
