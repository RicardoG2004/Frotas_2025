using FluentValidation;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs
{
    public class PerfilFuncionalidadeAssociationRequest
        : PerfilFuncionalidadeOptionsAssociationRequest
    {
        public string? FuncionalidadeId { get; set; }
    }

    public class PerfilFuncionalidadeAssociationValidator
        : AbstractValidator<PerfilFuncionalidadeAssociationRequest>
    {
        public PerfilFuncionalidadeAssociationValidator()
        {
            // Validate that FuncionalidadeId is provided
            _ = RuleFor(m => m.FuncionalidadeId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo FuncionalidadeId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo FuncionalidadeId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo FuncionalidadeId não pode ser um GUID vazio");

            // Manually trigger validation for the base class
            Include(new PerfilFuncionalidadeOptionsAssociationValidator());
        }

        public class PerfilFuncionalidadeAssociationRequestListValidator
            : AbstractValidator<List<PerfilFuncionalidadeAssociationRequest>>
        {
            public PerfilFuncionalidadeAssociationRequestListValidator()
            {
                // Apply the individual validator for each item in the list
                _ = RuleForEach(x => x)
                    .SetValidator(new PerfilFuncionalidadeAssociationValidator());
            }
        }
    }
}
