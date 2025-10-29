using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class UpdateEntidadeContactoRequest : IDto
  {
    public required string EntidadeContactoTipoId { get; set; }
    public required string EntidadeId { get; set; }
    public required string Valor { get; set; }
    public required bool Principal { get; set; }
  }

  public class UpdateEntidadeContactoValidator : AbstractValidator<UpdateEntidadeContactoRequest>
  {
    public UpdateEntidadeContactoValidator()
    {
      _ = RuleFor(x => x.EntidadeContactoTipoId).NotEmpty();
      _ = RuleFor(x => x.EntidadeId).NotEmpty();
      _ = RuleFor(x => x.Valor).NotEmpty();
    }
  }
}
