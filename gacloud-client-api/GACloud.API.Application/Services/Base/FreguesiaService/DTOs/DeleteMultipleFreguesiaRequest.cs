using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.FreguesiaService.DTOs
{
  public class DeleteMultipleFreguesiaRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }

  public class DeleteMultipleFreguesiaValidator
    : AbstractValidator<DeleteMultipleFreguesiaRequest>
  {
    public DeleteMultipleFreguesiaValidator()
    {
      _ = RuleFor(x => x.Ids)
        .NotEmpty()
        .WithMessage("A lista de IDs não pode estar vazia")
        .Must(ids => ids != null && ids.All(id => id != Guid.Empty))
        .WithMessage("Todos os IDs devem ser GUIDs válidos");
    }
  }
}

