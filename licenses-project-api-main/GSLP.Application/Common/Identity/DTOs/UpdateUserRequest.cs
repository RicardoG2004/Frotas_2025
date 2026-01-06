using FluentValidation;
using GSLP.Application.Common.Identity.Enums;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Common.Identity.DTOs
{
    public class UpdateUserRequest : IDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string RoleId { get; set; }
        public string? LicencaId { get; set; }
    }

    public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
    {
        public UpdateUserValidator()
        {
            _ = RuleFor(x => x.FirstName).NotEmpty();
            _ = RuleFor(x => x.LastName).NotEmpty();
            _ = RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O e-mail é obrigatório.")
                .EmailAddress()
                .WithMessage("Por favor, insira um e-mail válido.");
            _ = RuleFor(x => x.IsActive).NotNull(); //Null will accept true or false
            _ = RuleFor(x => x.RoleId)
                .Must(role =>
                    Enum.GetNames<UserRole>()
                        .Any(enumName =>
                            string.Equals(enumName, role, StringComparison.OrdinalIgnoreCase)
                        )
                )
                .WithMessage("Use apenas: " + string.Join(", ", Enum.GetNames<UserRole>()));

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
