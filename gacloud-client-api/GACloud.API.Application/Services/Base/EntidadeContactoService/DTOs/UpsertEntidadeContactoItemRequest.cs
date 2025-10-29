using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class UpsertEntidadeContactoItemRequest : IDto
  {
    public string? Id { get; set; }
    public required int EntidadeContactoTipoId { get; set; }
    public required string Valor { get; set; }
    public required bool Principal { get; set; }
  }

  public class UpsertEntidadeContactoItemValidator
    : AbstractValidator<UpsertEntidadeContactoItemRequest>
  {
    public UpsertEntidadeContactoItemValidator()
    {
      _ = RuleFor(x => x.EntidadeContactoTipoId).NotEmpty();
      _ = RuleFor(x => x.Valor).NotEmpty();
    }
  }
}
