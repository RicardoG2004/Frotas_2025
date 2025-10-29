using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Cemiterio", Schema = "Cemiterios")]
  public class Cemiterio : AuditableEntity
  {
    public string Nome { get; set; }
    public string Morada { get; set; }
    public Guid? CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public bool Predefinido { get; set; }
    public ICollection<Proprietario> Proprietarios { get; set; } = [];
  }
}
