using FluentValidation;
using GSLP.Application.Common.Marker;

namespace GSLP.Infrastructure.Auth.JWT.DTOs
{
    public class TokenRequest : IDto
    {
        // tenant key in header
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class TokenRequestValidator : AbstractValidator<TokenRequest>
    {
        public TokenRequestValidator()
        {
            _ = RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O e-mail é obrigatório.")
                .EmailAddress()
                .WithMessage("Por favor, insira um e-mail válido.");
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
        }
    }
}
