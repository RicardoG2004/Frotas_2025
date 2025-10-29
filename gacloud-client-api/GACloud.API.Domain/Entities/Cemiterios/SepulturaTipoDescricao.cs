using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("SepulturaTipoDescricao", Schema = "Cemiterios")]
  public class SepulturaTipoDescricao : AuditableEntity
  {
    public string Descricao { get; set; }
  }
}
