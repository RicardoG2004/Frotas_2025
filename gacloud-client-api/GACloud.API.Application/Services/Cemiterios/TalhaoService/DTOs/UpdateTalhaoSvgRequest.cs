using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs
{
  public class UpdateTalhaoSvgRequest : IDto
  {
    public required bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
  }

  public class UpdateTalhaoSvgValidator
    : AbstractValidator<UpdateTalhaoSvgRequest>
  {
    public UpdateTalhaoSvgValidator()
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

