using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Rubrica", Schema = "Base")]
  public class Rubrica : AuditableEntity
  {
    public string Codigo { get; set; }
    public Guid EpocaId { get; set; }
    public Epoca Epoca { get; set; }
    public string Descricao { get; set; }

    [Column(TypeName = "varchar(1)")]
    public string ClassificacaoTipo { get; set; } = "E";
    public int RubricaTipo { get; set; } = 1;
  }
}
