using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Modelo", Schema = "Frotas")]
  public class Modelo : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid MarcaId { get; set; }
    public Marca Marca { get; set; }
  }
}
