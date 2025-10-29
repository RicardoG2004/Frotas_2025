using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class UpdateModeloRequest : IDto
  {
    public required string Nome { get; set; }
    public required Guid MarcaId { get; set; }
  }

  public class UpdateModeloValidator : AbstractValidator<UpdateModeloRequest>
  {
    public UpdateModeloValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.MarcaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("MarcaId deve ser uma GUID válida e não estar vazia");
    }
  }
}
