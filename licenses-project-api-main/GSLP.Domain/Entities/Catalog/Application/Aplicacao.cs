using System.ComponentModel.DataAnnotations.Schema;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;

namespace GSLP.Domain.Entities.Catalog.Application
{
  [Table("Aplicacoes", Schema = "Aplicacao")]
  public class Aplicacao : AuditableEntity
  {
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public string Versao { get; set; }
    public string FicheiroXAP { get; set; }
    public bool Ativo { get; set; }
    public ICollection<Modulo> Modulos { get; set; } = [];
    public ICollection<Licenca> Licencas { get; set; } = [];
    public Guid AreaId { get; set; }
    public Area Area { get; set; }
  }
}
