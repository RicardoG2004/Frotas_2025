using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs
{
  public class DeleteMultipleViaturaRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }

  public class DeleteMultipleViaturaValidator : AbstractValidator<DeleteMultipleViaturaRequest>
  {
    public DeleteMultipleViaturaValidator()
    {
      _ = RuleFor(x => x.Ids)
        .NotEmpty()
        .WithMessage("A lista de IDs não pode estar vazia")
        .Must(ids => ids != null && ids.All(id => id != Guid.Empty))
        .WithMessage("Todos os IDs devem ser GUIDs válidos");
    }
  }
}

