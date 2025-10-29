using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
{
  [Table("CodigoPostal", Schema = "Base")]
  public class CodigoPostal : AuditableEntity
  {
    public string Codigo { get; set; }
    public string Localidade { get; set; }
    public ICollection<Rua> Ruas { get; set; } = [];
  }
}
