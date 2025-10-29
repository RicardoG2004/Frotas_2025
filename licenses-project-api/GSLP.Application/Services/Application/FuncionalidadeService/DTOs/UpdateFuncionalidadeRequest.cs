using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Application.FuncionalidadeService.DTOs
{
    public class UpdateFuncionalidadeRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public bool? Ativo { get; set; }
        public string? ModuloId { get; set; }
    }

    public class UpdateFuncionalidadeValidator : AbstractValidator<UpdateFuncionalidadeRequest>
    {
        public UpdateFuncionalidadeValidator()
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
