using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Talhao", Schema = "Cemiterios")]
  public class Talhao : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid? ZonaId { get; set; }
    public Zona Zona { get; set; }
    public bool TemSvgShape { get; set; }
    public string ShapeId { get; set; }
  }
}
