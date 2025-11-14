using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.CargoService.DTOs
{
    public class CreateCargoRequest : IDto
    {
        public required string Designacao { get; set; }
    }

    public class CreateCargoValidator : AbstractValidator<CreateCargoRequest>
    {
        public CreateCargoValidator()
        {
            _ = RuleFor(x => x.Designacao).NotEmpty();
        }
    }
}