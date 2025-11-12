using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaEquipamento", Schema = "Frotas")]
public class ViaturaEquipamento : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public Guid EquipamentoId { get; set; }
  public Equipamento Equipamento { get; set; }
}

