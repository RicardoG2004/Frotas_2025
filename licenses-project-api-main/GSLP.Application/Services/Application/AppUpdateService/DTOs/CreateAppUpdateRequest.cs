using FluentValidation;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;
using GSLP.Domain.Enums;

namespace GSLP.Application.Services.Application.AppUpdateService.DTOs
{
    public class CreateAppUpdateRequest : IDto
    {
        public string? Versao { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataLancamento { get; set; }
        public bool Ativo { get; set; }
        public bool Obrigatorio { get; set; }
        public string? VersaoMinima { get; set; }
        public UpdateType TipoUpdate { get; set; } = UpdateType.Both; // Default to Both
        public Guid AplicacaoId { get; set; }
        public string? NotasAtualizacao { get; set; }
        public List<Guid>? ClienteIds { get; set; } // If null or empty, update is available to all clients
    }

    public class CreateAppUpdateValidator : AbstractValidator<CreateAppUpdateRequest>
    {
        public CreateAppUpdateValidator()
        {
            _ = RuleFor(x => x.Versao)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Versão não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Versão não pode ser vazio.")
                .Matches(@"^\d+\.\d+\.\d+$")
                .WithMessage("O campo Versão deve seguir o formato X.Y.Z (ex: 1.2.3)");

            _ = RuleFor(x => x.Descricao)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Descrição não pode ser nulo.")
                .NotEmpty()
                .WithMessage("O campo Descrição não pode ser vazio.");

            _ = RuleFor(x => x.AplicacaoId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O campo Aplicação não pode ser vazio");

            _ = RuleFor(x => x.VersaoMinima)
                .Matches(@"^\d+\.\d+\.\d+$")
                .When(x => !string.IsNullOrEmpty(x.VersaoMinima))
                .WithMessage("O campo Versão Mínima deve seguir o formato X.Y.Z (ex: 1.2.3)");

            _ = RuleFor(x => x.TipoUpdate)
                .IsInEnum()
                .WithMessage("O campo Tipo de Update deve ser um valor válido (API, Frontend, ou Both)");
        }
    }
}

