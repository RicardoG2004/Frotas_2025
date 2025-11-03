using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.DTOs
{
    public class CreateTaxaIvaRequest : IDto
    {
        public required string Descricao { get; set; }
        public required decimal Valor { get; set; }
        public required bool Ativo { get; set; }
    }

    public class CreateTaxaIvaValidator : AbstractValidator<CreateTaxaIvaRequest>
    {
        public CreateTaxaIvaValidator()
        {
            _ = RuleFor(x => x.Descricao).NotEmpty();
            _ = RuleFor(x => x.Valor).NotEmpty();
        }
    }
}