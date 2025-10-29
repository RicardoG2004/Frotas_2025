using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.RubricaService.DTOs
{
  public class DeleteMultipleRubricaRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }

  public class DeleteMultipleRubricaValidator : AbstractValidator<DeleteMultipleRubricaRequest>
  {
    public DeleteMultipleRubricaValidator()
    {
      _ = RuleFor(x => x.Ids)
        .NotEmpty()
        .WithMessage("A lista de IDs não pode estar vazia")
        .Must(ids => ids != null && ids.All(id => id != Guid.Empty))
        .WithMessage("Todos os IDs devem ser GUIDs válidos");
    }
  }
}
