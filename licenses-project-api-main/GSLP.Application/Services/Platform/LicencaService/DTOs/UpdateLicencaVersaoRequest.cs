using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class UpdateLicencaVersaoRequest : IDto
    {
        public string Versao { get; set; }
    }

    public class UpdateLicencaVersaoValidator : AbstractValidator<UpdateLicencaVersaoRequest>
    {
        public UpdateLicencaVersaoValidator()
        {
            _ = RuleFor(x => x.Versao)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("A versão é obrigatória.")
                .Matches(@"^\d+\.\d+\.\d+")
                .WithMessage("A versão deve estar no formato X.Y.Z (ex: 1.2.3)");
        }
    }
}

