using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Epoca", Schema = "Base")]
  public class Epoca : AuditableEntity
  {
    public string Ano { get; set; }
    public string Descricao { get; set; }
    public bool Predefinida { get; set; }
    public bool Bloqueada { get; set; }

    public Guid? EpocaAnteriorId { get; set; }

    [ForeignKey("EpocaAnteriorId")]
    public Epoca EpocaAnterior { get; set; }
  }
}
