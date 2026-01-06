using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs
{
    public class LicencaUtilizadorAssociationRequest : IDto
    {
        public string? UtilizadorId { get; set; }
        public bool? Ativo { get; set; }
    }

    public class LicencaUtilizadorAssociationRequestValidator
        : AbstractValidator<LicencaUtilizadorAssociationRequest>
    {
        public LicencaUtilizadorAssociationRequestValidator()
        {
            // Validate that UtilizadorId is provided
            _ = RuleFor(m => m.UtilizadorId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo UtilizadorId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo UtilizadorId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo UtilizadorId não pode ser um GUID vazio");

            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");
        }

        public class LicencaUtilizadorAssociationValidatorListValidator
            : AbstractValidator<List<LicencaUtilizadorAssociationRequest>>
        {
            public LicencaUtilizadorAssociationValidatorListValidator()
            {
                // Apply the individual validator for each item in the list
                _ = RuleForEach(x => x)
                    .SetValidator(new LicencaUtilizadorAssociationRequestValidator());
            }
        }
    }
}
