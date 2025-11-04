using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  [Table("Equipamento", Schema = "Frotas")]
  public class Equipamento : AuditableEntity
  {
    public string Designacao { get; set; }
    public string Garantia { get; set; }
    public string Obs { get; set; }
  }
}