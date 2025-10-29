using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs
{
  public class UpdateSepulturaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string TalhaoId { get; set; }
    public required string SepulturaTipoId { get; set; }
    public required int SepulturaEstadoId { get; set; }
    public required int SepulturaSituacaoId { get; set; }
    public decimal? Largura { get; set; }
    public decimal? Comprimento { get; set; }
    public decimal? Area { get; set; }
    public decimal? Profundidade { get; set; }
    public string? Fila { get; set; }
    public string? Coluna { get; set; }
    public DateTime? DataConcessao { get; set; }
    public DateTime? DataInicioAluguer { get; set; }
    public DateTime? DataFimAluguer { get; set; }
    public DateTime? DataInicioReserva { get; set; }
    public DateTime? DataFimReserva { get; set; }
    public DateTime? DataConhecimento { get; set; }
    public string? NumeroConhecimento { get; set; }
    public bool Fundura1 { get; set; } = true;
    public bool Fundura2 { get; set; }
    public bool Fundura3 { get; set; }
    public bool Anulado { get; set; }
    public DateTime? DataAnulacao { get; set; }
    public string? Observacao { get; set; }
    public bool Bloqueada { get; set; }
    public bool? Litigio { get; set; }
    public List<UpdateProprietarioFromSepulturaRequest>? Proprietarios { get; set; }
  }

  public class UpdateSepulturaValidator
    : AbstractValidator<UpdateSepulturaRequest>
  {
    public UpdateSepulturaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.TalhaoId).NotEmpty();
      _ = RuleFor(x => x.SepulturaTipoId).NotEmpty();
      _ = RuleFor(x => x.SepulturaEstadoId).NotEmpty();
      _ = RuleFor(x => x.SepulturaSituacaoId).NotEmpty();
    }
  }
}

