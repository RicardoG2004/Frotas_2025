using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.LicencaModuloService.DTOs
{
    public class LicencaModuloAssociationRequest : IDto
    {
        public string? LicencaId { get; set; }
        public string? ModuloId { get; set; }
    }

    public class LicencaModuloAssociationValidator
        : AbstractValidator<LicencaModuloAssociationRequest>
    {
        public LicencaModuloAssociationValidator()
        {
            // Validate that LicencaId is provided
            _ = RuleFor(m => m.LicencaId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo LicencaId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo LicencaId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo LicencaId não pode ser um GUID vazio");

            // Validate that ModuloId is provided
            _ = RuleFor(m => m.ModuloId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo ModuloId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo ModuloId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo ModuloId não pode ser um GUID vazio");
        }
    }
}
