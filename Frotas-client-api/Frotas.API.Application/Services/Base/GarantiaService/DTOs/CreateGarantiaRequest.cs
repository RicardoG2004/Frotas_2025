using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.GarantiaService.DTOs
{
    public class CreateGarantiaRequest : IDto
    {
        public required string Designacao { get; set; }
        public required int Anos { get; set; }
        public required int Kms { get; set; }
    }

    public class CreateGarantiaValidator : AbstractValidator<CreateGarantiaRequest>
    {
        public CreateGarantiaValidator()
        {
            _ = RuleFor(x => x.Designacao).NotEmpty();
            _ = RuleFor(x => x.Anos).NotEmpty();
            _ = RuleFor(x => x.Kms).NotEmpty();
        }
    }
}