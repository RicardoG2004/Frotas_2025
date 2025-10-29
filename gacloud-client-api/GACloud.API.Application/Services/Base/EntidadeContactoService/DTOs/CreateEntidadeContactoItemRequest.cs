using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class CreateEntidadeContactoItemRequest : IDto
  {
    public required int EntidadeContactoTipoId { get; set; }
    public required string Valor { get; set; }
    public required bool Principal { get; set; }
  }

  public class CreateEntidadeContactoItemValidator
    : AbstractValidator<CreateEntidadeContactoItemRequest>
  {
    public CreateEntidadeContactoItemValidator()
    {
      _ = RuleFor(x => x.EntidadeContactoTipoId).NotEmpty();
      _ = RuleFor(x => x.Valor).NotEmpty();
    }
  }
}
