using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Coveiro", Schema = "Frotas")]
  public class Coveiro : AuditableEntity
  {
    public string Nome { get; set; }
    public string NIF { get; set; }
    public Guid? RuaId { get; set; }
    public Rua Rua { get; set; }
    public Guid? CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public bool Historico { get; set; }
  }
}
