using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.ClienteService.DTOs
{
    public class UpdateClienteRequest : IDto
    {
        public string? Nome { get; set; }
        public string? Sigla { get; set; }
        public string? NIF { get; set; }
        public bool? Ativo { get; set; }
        public bool? DadosExternos { get; set; }
        public string? DadosUrl { get; set; }
    }

    public class UpdateClienteValidator : AbstractValidator<UpdateClienteRequest>
    {
        public UpdateClienteValidator()
        {
            _ = RuleFor(x => x.Nome)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Nome não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Nome não pode ser vazio.");

            _ = RuleFor(x => x.Sigla)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Sigla não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Sigla não pode ser vazio.")
                .Length(2, 10)
                .WithMessage("O campo Sigla deve ter entre 2 e 10 caracteres.");

            _ = RuleFor(x => x.NIF)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo NIF não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo NIF não pode ser vazio.")
                .Matches(@"^\d{9}$")
                .WithMessage("O campo NIF deve ser um número válido com 9 dígitos.");

            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");

            _ = RuleFor(x => x.DadosExternos)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo DadosExternos não pode ser nulo.");

            _ = RuleFor(x => x.DadosUrl)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo DadosUrl não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo DadosUrl não pode ser vazio.")
                .Must(GSLPHelpers.BeAValidUrl)
                .WithMessage("O campo DadosUrl deve ser uma URL válida.");
        }
    }
}
