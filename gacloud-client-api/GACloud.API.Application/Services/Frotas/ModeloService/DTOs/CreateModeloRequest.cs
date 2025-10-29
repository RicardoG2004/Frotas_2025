using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class CreateModeloRequest : IDto
  {
    public required string Nome { get; set; }
    public required string RuaId { get; set; }
    public required string CodigoPostalId { get; set; }
    public required bool Historico { get; set; }
  }

  public class CreateModeloValidator : AbstractValidator<CreateModeloRequest>
  {
    public CreateModeloValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.MarcaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("MarcaId deve ser uma GUID válida e não estar vazia");
    }
  }
}
