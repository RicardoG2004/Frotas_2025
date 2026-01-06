using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs
{
    public class PerfilFuncionalidadeOptionsAssociationRequest : IDto
    {
        public bool? AuthVer { get; set; }
        public bool? AuthAdd { get; set; }
        public bool? AuthChg { get; set; }
        public bool? AuthDel { get; set; }
        public bool? AuthPrt { get; set; }
    }

    public class PerfilFuncionalidadeOptionsAssociationValidator
        : AbstractValidator<PerfilFuncionalidadeOptionsAssociationRequest>
    {
        public PerfilFuncionalidadeOptionsAssociationValidator()
        {
            // Validate that all permission properties are provided
            _ = RuleFor(x => x.AuthVer)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("AuthVer é obrigatório.");
            _ = RuleFor(x => x.AuthAdd)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("AuthAdd é obrigatório.");
            _ = RuleFor(x => x.AuthChg)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("AuthChg é obrigatório.");
            _ = RuleFor(x => x.AuthDel)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("AuthDel é obrigatório.");
            _ = RuleFor(x => x.AuthPrt)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("AuthPrt é obrigatório.");
        }
    }
}
