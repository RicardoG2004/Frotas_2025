using FluentValidation;

namespace GSLP.Application.Common.Identity.DTOs
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequest>
    {
        public ForgotPasswordValidator()
        {
            _ = RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("O e-mail é obrigatório.")
                .EmailAddress()
                .WithMessage("Por favor, insira um e-mail válido.");
        }
    }
}
