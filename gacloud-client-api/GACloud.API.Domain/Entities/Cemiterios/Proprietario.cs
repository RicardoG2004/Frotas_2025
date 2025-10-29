using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Proprietario", Schema = "Cemiterios")]
  public class Proprietario : AuditableEntity
  {
    public Guid CemiterioId { get; set; }
    public Cemiterio Cemiterio { get; set; }
    public Guid EntidadeId { get; set; }
    public Entidade Entidade { get; set; }
    public ICollection<ProprietarioSepultura> Sepulturas { get; set; } = [];
  }
}
