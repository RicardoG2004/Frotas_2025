using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Zona", Schema = "Cemiterios")]
  public class Zona : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid? CemiterioId { get; set; }
    public Cemiterio Cemiterio { get; set; }
    public bool TemSvgShape { get; set; }
    public string ShapeId { get; set; }
  }
}
