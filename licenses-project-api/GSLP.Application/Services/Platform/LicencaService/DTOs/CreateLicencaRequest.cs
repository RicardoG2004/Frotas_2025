using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
    public class CreateLicencaRequest : IDto
    {
        public string? Nome { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int NumeroUtilizadores { get; set; }
        public string? AplicacaoId { get; set; }
        public string? ClienteId { get; set; }
    }

    public class CreateLicencaValidator : AbstractValidator<CreateLicencaRequest>
    {
        public CreateLicencaValidator()
        {
            _ = RuleFor(x => x.Nome)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O nome é obrigatório.");

            _ = RuleFor(x => x.DataInicio)
                .Cascade(CascadeMode.Stop)
                .LessThanOrEqualTo(DateTime.Now)
                .WithMessage("A data de início não pode ser no futuro.");

            _ = RuleFor(x => x.DataFim)
                .Cascade(CascadeMode.Stop)
                .GreaterThan(x => x.DataInicio)
                .WithMessage("A data de fim deve ser posterior à data de início.")
                .GreaterThanOrEqualTo(DateTime.Now)
                .WithMessage("A data de fim não pode ser no passado.");

            _ = RuleFor(x => x.NumeroUtilizadores)
                .Cascade(CascadeMode.Stop)
                .GreaterThan(0)
                .WithMessage("O número de utilizadores deve ser maior que 0.");

            _ = RuleFor(x => x.AplicacaoId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID da aplicação é obrigatório.")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID da aplicação deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID da aplicação não pode estar vazio");

            _ = RuleFor(x => x.ClienteId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID do cliente é obrigatório.")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID do cliente deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID do cliente não pode estar vazio");
        }
    }
}
