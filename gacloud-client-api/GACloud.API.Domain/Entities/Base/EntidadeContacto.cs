using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
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
