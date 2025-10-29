using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs
{
  public class UpdateSepulturaSvgRequest : IDto
  {
    public required bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
  }

  public class UpdateSepulturaSvgValidator
    : AbstractValidator<UpdateSepulturaSvgRequest>
  {
    public UpdateSepulturaSvgValidator()
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

