using FluentValidation;
using GSLP.Application.Common.Identity.Enums;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Common.Identity.DTOs
{
    public class UpdateAdminOrClientUserRequest : IDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string RoleId { get; set; }
        public bool IsActive { get; set; }
        public string? PerfilId { get; set; }
        public string ClienteId { get; set; }
        public string? LicencaId { get; set; }
    }

    public class UpdateAdminOrClientUserValidator
        : AbstractValidator<UpdateAdminOrClientUserRequest>
    {
        public UpdateAdminOrClientUserValidator()
        {
            _ = RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O e-mail é obrigatório.")
                .EmailAddress()
                .WithMessage("Por favor, insira um e-mail válido.");
            _ = RuleFor(x => x.FirstName).NotEmpty();
            _ = RuleFor(x => x.LastName).NotEmpty();

            _ = RuleFor(x => x.RoleId)
                .Must(role =>
                    string.Equals(role, nameof(UserRole.Admin), StringComparison.OrdinalIgnoreCase)
                    || string.Equals(
                        role,
                        nameof(UserRole.Client),
                        StringComparison.OrdinalIgnoreCase
                    )
                )
                .WithMessage("Apenas são permitidas roles de admin ou client");

            _ = RuleFor(x => x.IsActive).NotNull();

            _ = RuleFor(x => x.PerfilId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID do perfil é obrigatório.")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID do perfil deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID do perfil não pode estar vazio")
                .When(x =>
                    string.Equals(
                        x.RoleId,
                        nameof(UserRole.Client),
                        StringComparison.OrdinalIgnoreCase
                    )
                );

            _ = RuleFor(x => x.ClienteId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID do cliente é obrigatório.")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID do cliente deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID do cliente não pode estar vazio");

            // Validate LicencaId only when role is admin
            _ = RuleFor(x => x.LicencaId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID da licença é obrigatório para administradores")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID da licença deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID da licença não pode estar vazio")
                .When(x =>
                    string.Equals(
                        x.RoleId,
                        nameof(UserRole.Admin),
                        StringComparison.OrdinalIgnoreCase
                    )
                );
        }
    }
}
