using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.DTOs
{
    public class UpdateTaxaIvaRequest : IDto
    {
        public required string Descricao { get; set; }
        public required decimal Valor { get; set; }
        public required bool Ativo { get; set; }
    }

    public class UpdateTaxaIvaValidator : AbstractValidator<UpdateTaxaIvaRequest>
    {
        public UpdateTaxaIvaValidator()
        {
            _ = RuleFor(x => x.Descricao).NotEmpty();
            _ = RuleFor(x => x.Valor).NotEmpty();
        }
    }
}