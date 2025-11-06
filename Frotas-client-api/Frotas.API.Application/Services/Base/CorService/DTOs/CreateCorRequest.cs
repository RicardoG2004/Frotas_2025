using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.CorService.DTOs
{
    public class CreateCorRequest : IDto
    {
    public required string Designacao { get; set; }
    }

    public class CreateCorValidator : AbstractValidator<CreateCorRequest>
    {
    public CreateCorValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty().WithMessage("A designação da cor é obrigatória");
    }
    }
}