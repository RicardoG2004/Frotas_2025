using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Frotas
{
  [Table("Modelo", Schema = "Frotas")]
  public class Modelo : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid MarcaId { get; set; }
    public Marca Marca { get; set; }
  }
}
