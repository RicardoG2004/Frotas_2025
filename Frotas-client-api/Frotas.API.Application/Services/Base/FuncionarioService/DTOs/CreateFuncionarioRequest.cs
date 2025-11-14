using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.FuncionarioService.DTOs
{
    public class CreateFuncionarioRequest : IDto
    {
        public required string Nome { get; set; }
        public required string Morada { get; set; }
        public required Guid CodigoPostalId { get; set; }
        public required Guid FreguesiaId { get; set; }
        public required Guid CargoId { get; set; }
        public required string Email { get; set; }
        public required string Telefone { get; set; }
        public required Guid DelegacaoId { get; set; }
        public required bool Ativo { get; set; }
    }

    public class CreateFuncionarioValidator : AbstractValidator<CreateFuncionarioRequest>
    {
        public CreateFuncionarioValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.Morada).NotEmpty();
            _ = RuleFor(x => x.CodigoPostalId).NotEmpty();
            _ = RuleFor(x => x.FreguesiaId).NotEmpty();
            _ = RuleFor(x => x.CargoId).NotEmpty();
            _ = RuleFor(x => x.Email).NotEmpty();
            _ = RuleFor(x => x.Telefone).NotEmpty();
            _ = RuleFor(x => x.DelegacaoId).NotEmpty();
            _ = RuleFor(x => x.Ativo).NotEmpty();
        }
    }
}