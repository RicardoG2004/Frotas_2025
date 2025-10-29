using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs
{
  public class UpdateZonaSvgRequest : IDto
  {
    public required bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
  }

  public class UpdateZonaSvgValidator : AbstractValidator<UpdateZonaSvgRequest>
  {
    public UpdateZonaSvgValidator()
    {
      _ = RuleFor(x => x.TemSvgShape).NotNull();
      _ = When(
        x => x.TemSvgShape,
        () =>
        {
          _ = RuleFor(x => x.ShapeId)
            .NotNull()
            .NotEmpty()
            .WithMessage("O ShapeId é obrigatório quando TemSvgShape é verdadeiro");
        }
      );
    }
  }
}

