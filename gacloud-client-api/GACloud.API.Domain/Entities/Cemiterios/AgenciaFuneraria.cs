using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("AgenciaFuneraria", Schema = "Cemiterios")]
  public class AgenciaFuneraria : AuditableEntity
  {
    public bool Historico { get; set; }
    public Guid? EntidadeId { get; set; }
    public Entidade Entidade { get; set; }
  }
}
