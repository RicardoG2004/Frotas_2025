using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Coveiro", Schema = "Cemiterios")]
  public class Coveiro : AuditableEntity
  {
    public string Nome { get; set; }
    public string NIF { get; set; }
    public Guid? RuaId { get; set; }
    public Rua Rua { get; set; }
    public Guid? CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public bool Historico { get; set; }
  }
}
