using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.EntidadeContactoService.DTOs;
using Frotas.API.Application.Services.Base.RuaService.DTOs;

namespace Frotas.API.Application.Services.Base.EntidadeService.DTOs
{
  public class EntidadeDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public DateTime CreatedOn { get; set; }
    public string? NIF { get; set; }
    public bool NIFEstrangeiro { get; set; }
    public Guid RuaId { get; set; }
    public RuaDTO? Rua { get; set; }
    public string? RuaNumeroPorta { get; set; }
    public string? RuaAndar { get; set; }
    public int CartaoIdentificacaoTipoId { get; set; }
    public string? CartaoIdentificacaoNumero { get; set; }
    public DateTime CartaoIdentificacaoDataEmissao { get; set; }
    public DateTime CartaoIdentificacaoDataValidade { get; set; }
    public int EstadoCivilId { get; set; }
    public string? Sexo { get; set; }
    public bool Ativo { get; set; }
    public bool Historico { get; set; }
    public IEnumerable<EntidadeContactoDTO>? Contactos { get; set; }
  }
}
