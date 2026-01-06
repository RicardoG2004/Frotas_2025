using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Application.AreaService.DTOs
{
    public class CreateAreaRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Color { get; set; }
    }

    public class CreateAreaValidator : AbstractValidator<CreateAreaRequest>
    {
        public CreateAreaValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.Color).NotEmpty();
        }
    }
}
