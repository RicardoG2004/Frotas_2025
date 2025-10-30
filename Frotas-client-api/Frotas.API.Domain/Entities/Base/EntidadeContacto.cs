using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("EntidadeContacto", Schema = "Base")]
  public class EntidadeContacto : AuditableEntity
  {
    public int EntidadeContactoTipoId { get; set; }
    public Guid EntidadeId { get; set; }
    public Entidade Entidade { get; set; }
    public string Valor { get; set; }
    public bool Principal { get; set; }
  }
}
