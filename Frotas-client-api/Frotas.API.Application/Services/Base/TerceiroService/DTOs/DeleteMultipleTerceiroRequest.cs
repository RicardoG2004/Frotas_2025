using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.TerceiroService.DTOs
{
    public class DeleteMultipleTerceiroRequest : IDto
    {
        public required IEnumerable<Guid> Ids { get; set; }
    }

    public class DeleteMultipleTerceiroValidator : AbstractValidator<DeleteMultipleTerceiroRequest>
    {
        public DeleteMultipleTerceiroValidator()
        {
            _ = RuleFor(x => x.Ids).NotEmpty();
        }
    }
}