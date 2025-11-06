using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.LocalizacaoService.DTOs
{
    public class DeleteMultipleLocalizacaoRequest : IDto
    {
        public required IEnumerable<Guid> Ids { get; set; }
    }

    public class DeleteMultipleLocalizacaoValidator : AbstractValidator<DeleteMultipleLocalizacaoRequest>
    {
        public DeleteMultipleLocalizacaoValidator()
        {
            _ = RuleFor(x => x.Ids).NotEmpty();
            _ = RuleFor(x => x.Ids).Must(ids => ids.All(id => id != Guid.Empty));
        }
    }
}