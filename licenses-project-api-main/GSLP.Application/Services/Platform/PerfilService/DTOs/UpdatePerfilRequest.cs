using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class UpdatePerfilRequest : IDto
    {
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
    }

    public class UpdatePerfilValidator : AbstractValidator<UpdatePerfilRequest>
    {
        public UpdatePerfilValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.Ativo).NotNull().WithMessage("O campo Ativo não pode ser nulo");
        }
    }
}
