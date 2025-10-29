using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs
{
  public class UpdateProprietarioSepulturaRequest : IDto
  {
    public Guid? Id { get; set; } // null for new, existing id for update
    public required Guid SepulturaId { get; set; }
    public required DateTime Data { get; set; }
    public required bool Ativo { get; set; }
    public required bool IsProprietario { get; set; }
    public required bool IsResponsavel { get; set; }
    public required bool IsResponsavelGuiaReceita { get; set; }
    public DateTime? DataInativacao { get; set; }
    public string? Fracao { get; set; }
    public required bool Historico { get; set; }
    public string? Observacoes { get; set; }
  }

  public class UpdateProprietarioSepulturaValidator
    : AbstractValidator<UpdateProprietarioSepulturaRequest>
  {
    public UpdateProprietarioSepulturaValidator()
    {
      _ = RuleFor(x => x.SepulturaId).NotEmpty();
      _ = RuleFor(x => x.Data).NotEmpty();
    }
  }
}

