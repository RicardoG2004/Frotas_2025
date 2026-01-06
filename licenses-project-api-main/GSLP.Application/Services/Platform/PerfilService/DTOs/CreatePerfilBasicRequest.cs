using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class CreatePerfilBasicRequest : IDto
    {
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
    }

    public class CreatePerfilBasicValidator : AbstractValidator<CreatePerfilBasicRequest>
    {
        public CreatePerfilBasicValidator()
        {
            _ = RuleFor(x => x.Nome).Cascade(CascadeMode.Stop).NotEmpty();

            _ = RuleFor(x => x.Ativo)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                .WithMessage("O campo Ativo não pode ser nulo");
        }
    }
}
