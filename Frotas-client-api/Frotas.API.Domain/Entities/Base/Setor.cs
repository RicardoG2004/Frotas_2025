using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Setor", Schema = "Base")]
  public class Setor : AuditableEntity
  {
    public string Descricao { get; set; }
  }
}