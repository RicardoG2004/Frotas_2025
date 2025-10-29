using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Cemiterios;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Base
{
  [Table("Entidade", Schema = "Base")]
  public class Entidade : AuditableEntity
  {
    public string Nome { get; set; }
    public string NIF { get; set; }
    public bool NIFEstrangeiro { get; set; }
    public Guid RuaId { get; set; }
    public Rua Rua { get; set; }
    public string RuaNumeroPorta { get; set; }
    public string RuaAndar { get; set; }
    public int CartaoIdentificacaoTipoId { get; set; }
    public string CartaoIdentificacaoNumero { get; set; }
    public DateTime CartaoIdentificacaoDataEmissao { get; set; }
    public DateTime CartaoIdentificacaoDataValidade { get; set; }
    public int EstadoCivilId { get; set; }
    public string Sexo { get; set; }
    public bool Ativo { get; set; }
    public bool Historico { get; set; }
    public ICollection<EntidadeContacto> Contactos { get; set; } = new List<EntidadeContacto>();
    public ICollection<Proprietario> Proprietarios { get; set; } = [];
  }
}
