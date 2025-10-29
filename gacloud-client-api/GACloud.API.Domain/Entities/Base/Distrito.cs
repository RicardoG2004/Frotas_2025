using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
{
  [Table("Distrito", Schema = "Base")]
  public class Distrito : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid PaisId { get; set; }
    public Pais Pais { get; set; }
    public ICollection<Concelho> Concelhos { get; set; } = [];
  }
}
