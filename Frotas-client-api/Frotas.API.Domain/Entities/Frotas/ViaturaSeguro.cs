using System;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas;

[Table("ViaturaSeguro", Schema = "Frotas")]
public class ViaturaSeguro : AuditableEntity
{
  public Guid ViaturaId { get; set; }
  public Viatura Viatura { get; set; }

  public Guid SeguroId { get; set; }
  public Seguro Seguro { get; set; }
}

