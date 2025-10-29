using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Application.AreaService.DTOs
{
    public class UpdateAreaRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Color { get; set; }
    }

    public class UpdateAreaValidator : AbstractValidator<UpdateAreaRequest>
    {
        public UpdateAreaValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.Color).NotEmpty();
        }
    }
}
