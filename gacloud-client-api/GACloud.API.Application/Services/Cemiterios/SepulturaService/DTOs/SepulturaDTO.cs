using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs
{
  public class SepulturaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid TalhaoId { get; set; }
    public TalhaoDTO? Talhao { get; set; }
    public Guid SepulturaTipoId { get; set; }
    public SepulturaTipoDTO? SepulturaTipo { get; set; }
    public int SepulturaEstadoId { get; set; }
    public int SepulturaSituacaoId { get; set; }
    public DateTime? DataConcessao { get; set; }
    public decimal? Largura { get; set; }
    public decimal? Comprimento { get; set; }
    public decimal? Area { get; set; }
    public decimal? Profundidade { get; set; }
    public string? Fila { get; set; }
    public string? Coluna { get; set; }
    public DateTime? DataInicioAluguer { get; set; }
    public DateTime? DataFimAluguer { get; set; }
    public DateTime? DataInicioReserva { get; set; }
    public DateTime? DataFimReserva { get; set; }
    public string? NumeroConhecimento { get; set; }
    public DateTime? DataConhecimento { get; set; }
    public bool Fundura1 { get; set; } = true;
    public bool Fundura2 { get; set; }
    public bool Fundura3 { get; set; }
    public bool Anulado { get; set; }
    public DateTime? DataAnulacao { get; set; }
    public string? Observacao { get; set; }
    public bool Bloqueada { get; set; }
    public bool? Litigio { get; set; }
    public bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
    public DateTime CreatedOn { get; set; }
    public List<ProprietarioSepulturaDTO>? Proprietarios { get; set; }
  }
}

