using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("DefuntoTipo", Schema = "Cemiterios")]
  public class DefuntoTipo : AuditableEntity
  {
    public string Descricao { get; set; }
  }
}
