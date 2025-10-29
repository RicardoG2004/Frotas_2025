using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Frotas
{
  [Table("AgenciaFuneraria", Schema = "Frotas")]
  public class AgenciaFuneraria : AuditableEntity
  {
    public bool Historico { get; set; }
    public Guid? EntidadeId { get; set; }
    public Entidade Entidade { get; set; }
  }
}
