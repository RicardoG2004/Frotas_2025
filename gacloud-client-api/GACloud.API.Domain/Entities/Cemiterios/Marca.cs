using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Marca", Schema = "Cemiterios")]
  public class Marca : AuditableEntity
  {
    public string Nome { get; set; }
  }
}
