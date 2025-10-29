using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.EpocaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs
{
  public class SepulturaTipoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? EpocaId { get; set; }
    public EpocaDTO? Epoca { get; set; }
    public Guid? SepulturaTipoDescricaoId { get; set; }
    public SepulturaTipoDescricaoDTO? SepulturaTipoDescricao { get; set; }
    public string? VendaRubrica { get; set; }
    public decimal? VendaValor { get; set; }
    public string? VendaDescricao { get; set; }
    public string? AluguerRubrica { get; set; }
    public decimal? AluguerValor { get; set; }
    public string? AluguerDescricao { get; set; }
    public string? AlvaraRubrica { get; set; }
    public decimal? AlvaraValor { get; set; }
    public string? AlvaraDescricao { get; set; }
    public string? TransladacaoRubrica { get; set; }
    public decimal? TransladacaoValor { get; set; }
    public string? TransladacaoDescricao { get; set; }
    public string? TransferenciaRubrica { get; set; }
    public decimal? TransferenciaValor { get; set; }
    public string? TransferenciaDescricao { get; set; }
    public string? ExumacaoRubrica { get; set; }
    public decimal? ExumacaoValor { get; set; }
    public string? ExumacaoDescricao { get; set; }
    public string? InumacaoRubrica { get; set; }
    public decimal? InumacaoValor { get; set; }
    public string? InumacaoDescricao { get; set; }
    public string? ConcessionadaRubrica { get; set; }
    public decimal? ConcessionadaValor { get; set; }
    public string? ConcessionadaDescricao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

