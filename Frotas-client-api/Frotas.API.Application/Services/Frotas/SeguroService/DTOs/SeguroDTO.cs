using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.DTOs
{
  public class SeguroDTO : IDto
  {
    public Guid Id { get; set; }
    public string Designacao { get; set; }
    public string Apolice { get; set; }
    public Guid SeguradoraId { get; set; }
    public SeguradoraDTO Seguradora { get; set; }
    public bool AssistenciaViagem { get; set; }
    public bool CartaVerde { get; set; }
    public decimal ValorCobertura { get; set; }
    public decimal CustoAnual { get; set; }
    public string RiscosCobertos { get; set; }
    public DateTime DataInicial { get; set; }
    public DateTime DataFinal { get; set; }
    public PeriodicidadeSeguro Periodicidade { get; set; }
    public MetodoPagamentoSeguro? MetodoPagamento { get; set; }
    public DateTime? DataPagamento { get; set; }
  }
}