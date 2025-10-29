using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Application.AplicacaoService.DTOs
{
    public class CreateAplicacaoRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Versao { get; set; }
        public bool? Ativo { get; set; }
        public string? AreaId { get; set; }
    }

    public class CreateAplicacaoValidator : AbstractValidator<CreateAplicacaoRequest>
    {
        public CreateAplicacaoValidator()
        {
            _ = RuleFor(x => x.Nome)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Nome não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Nome não pode ser vazio.");

            _ = RuleFor(x => x.Descricao)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Descricao não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Descricao não pode ser vazio.");

            _ = RuleFor(x => x.Versao)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Versao não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Versao não pode ser vazio.");

            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");

            _ = RuleFor(x => x.AreaId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo AreaId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo AreaId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo AreaId não pode ser um GUID vazio");
        }
    }
}
