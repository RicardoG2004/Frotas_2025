using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class CreatePerfilRequest : IDto
    {
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
        public string? LicencaId { get; set; }
    }

    public class CreatePerfilValidator : AbstractValidator<CreatePerfilRequest>
    {
        public CreatePerfilValidator()
        {
            _ = RuleFor(x => x.Nome).Cascade(CascadeMode.Stop).NotEmpty();
            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");
            _ = RuleFor(m => m.LicencaId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo Id da Licença não pode estar vazia")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo Id da Licença deve ser uma GUID válida")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo Id da Licença não pode ser uma GUID vazia");
        }
    }
}
