using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
{
  [Table("Pais", Schema = "Base")]
  public class Pais : AuditableEntity
  {
    public string Codigo { get; set; }
    public string Nome { get; set; }
    public string Prefixo { get; set; }
    public ICollection<Distrito> Distritos { get; set; } = [];
  }
}
