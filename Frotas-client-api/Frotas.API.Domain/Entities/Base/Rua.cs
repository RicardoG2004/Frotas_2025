using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Rua", Schema = "Base")]
  public class Rua : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid FreguesiaId { get; set; }
    public Freguesia Freguesia { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public ICollection<Entidade> Entidades { get; set; } = [];
  }
}
