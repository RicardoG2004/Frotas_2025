using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("TipoViatura", Schema = "Frotas")]
  public class TipoViatura : AuditableEntity
  {
    public string Designacao { get; set; }
  }
}