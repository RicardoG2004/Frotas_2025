using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Garantia", Schema = "Base")]
  public class Garantia : AuditableEntity
  {
    public string Designacao { get; set; }
    public int Anos { get; set; }
    public int Kms { get; set; }
    public ICollection<ViaturaGarantia> ViaturaGarantias { get; set; } = new List<ViaturaGarantia>();
  }
}