using FluentValidation;
using Frotas.API.Application.Common.Marker;

  namespace Frotas.API.Application.Services.Frotas.ServicoService.DTOs
  {
  public class DeleteMultipleServicoRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }

  public class DeleteMultipleServicoValidator
    : AbstractValidator<DeleteMultipleServicoRequest>
  {
    public DeleteMultipleServicoValidator()
    {
      _ = RuleFor(x => x.Ids)
        .NotEmpty()
        .WithMessage("A lista de IDs não pode estar vazia")
        .Must(ids => ids != null && ids.All(id => id != Guid.Empty))
        .WithMessage("Todos os IDs devem ser GUIDs válidos");
    }
  }
}

