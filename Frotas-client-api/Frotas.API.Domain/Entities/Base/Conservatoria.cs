using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Conservatoria", Schema = "Base")]
  public class Conservatoria : AuditableEntity
  {
    public string Nome { get; set; }
    public string Morada { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public Guid FreguesiaId { get; set; }
    public Freguesia Freguesia { get; set; }
    public Guid ConcelhoId { get; set; }
    public Concelho Concelho { get; set; }
    public string Telefone { get; set; }
  }
}