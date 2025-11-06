using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Base
{
  [Table("Delegacao", Schema = "Base")]
  public class Delegacao : AuditableEntity
  {
    public string Designacao { get; set; }
    public string Morada { get; set; }
    public string Localidade { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostal CodigoPostal { get; set; }
    public Guid PaisId { get; set; }
    public Pais Pais { get; set; }
    public string Telefone { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string EnderecoHttp { get; set; }
  }
}