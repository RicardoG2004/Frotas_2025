using FluentValidation;
using GSLP.Application.Common.Identity.Enums;
using GSLP.Application.Common.Marker;
using GSLP.Application.Utility;

namespace GSLP.Application.Common.Identity.DTOs
{
    public class RegisterUserRequest : IDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string RoleId { get; set; }
        public string? ClienteId { get; set; }
        public string? LicencaId { get; set; }
    }

    public class RegisterUserValidator : AbstractValidator<RegisterUserRequest>
    {
        public RegisterUserValidator()
        {
            _ = RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O e-mail é obrigatório.")
                .EmailAddress()
                .WithMessage("Por favor, insira um e-mail válido.");
            _ = RuleFor(x => x.FirstName).NotEmpty();
            _ = RuleFor(x => x.LastName).NotEmpty();
            _ = RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Por favor introduza a palavra-passe")
                .MinimumLength(6)
                .WithMessage("A palavra-passe deve ter pelo menos 6 caracteres")
                .Matches("[A-Z]")
                .WithMessage("A palavra-passe deve conter pelo menos uma letra maiúscula")
                .Matches("[a-z]")
                .WithMessage("A palavra-passe deve conter pelo menos uma letra minúscula")
                .Matches("[0-9]")
                .WithMessage("A palavra-passe deve conter pelo menos um dígito numérico ('0'-'9')")
                .Matches(@"[\W_]")
                .WithMessage("A palavra-passe deve conter pelo menos um caráter não alfanumérico")
                .Matches(@"^[^\s]+$")
                .WithMessage("A palavra-passe não deve conter espaços"); // Password shouldn't contain spaces

            _ = RuleFor(x => x.RoleId)
                .Must(role => Enum.TryParse<UserRole>(role, true, out _))
                .WithMessage("Use apenas: " + string.Join(", ", Enum.GetNames<UserRole>()));

            _ = RuleFor(x => x.ClienteId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID do cliente é obrigatório.")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID do cliente deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID do cliente não pode estar vazio");

            _ = RuleFor(x => x.LicencaId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O ID da licença é obrigatório")
                .Must(GSLPHelpers.BeAValidGuid)
                .WithMessage("O ID da licença deve ser válido")
                .Must(GSLPHelpers.BeNotEmptyGuid)
                .WithMessage("O ID da licença não pode estar vazio");
        }
    }
}
