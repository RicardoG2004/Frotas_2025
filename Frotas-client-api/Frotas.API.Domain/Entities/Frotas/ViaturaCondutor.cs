using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaCondutor", Schema = "Frotas")]
public class ViaturaCondutor : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public Guid FuncionarioId { get; set; }
  public Funcionario Funcionario { get; set; }
}

