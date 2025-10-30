using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("AgenciaFuneraria", Schema = "Frotas")]
  public class AgenciaFuneraria : AuditableEntity
  {
    public bool Historico { get; set; }
    public Guid? EntidadeId { get; set; }
    public Entidade Entidade { get; set; }
  }
}
