using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
{
  [Table("Concelho", Schema = "Base")]
  public class Concelho : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid DistritoId { get; set; }
    public Distrito Distrito { get; set; }
    public ICollection<Freguesia> Freguesias { get; set; } = [];
  }
}
