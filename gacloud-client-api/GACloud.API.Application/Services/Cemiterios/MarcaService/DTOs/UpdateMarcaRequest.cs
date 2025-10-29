using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class UpdateMarcaRequest : IDto
  {
    public required string Nome { get; set; }
  }

  public class UpdateMarcaValidator : AbstractValidator<UpdateMarcaRequest>
  {
    public UpdateMarcaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
    }
  }
}
