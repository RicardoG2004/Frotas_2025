using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Application.ModuloService.DTOs
{
    public class UpdateModuloRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public bool? Ativo { get; set; }
        public string? AplicacaoId { get; set; }
    }

    public class UpdateModuloValidator : AbstractValidator<UpdateModuloRequest>
    {
        public UpdateModuloValidator()
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

            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");

            _ = RuleFor(m => m.AplicacaoId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo AplicacaoId não pode ser vazio")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O campo AplicacaoId deve ser um GUID válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O campo AplicacaoId não pode ser um GUID vazio");
        }
    }
}
