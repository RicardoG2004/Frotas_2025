using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.LocalizacaoService.DTOs
{
    public class CreateLocalizacaoRequest : IDto
    {
        public required string Designacao { get; set; }
        public required string Morada { get; set; }
        public required Guid CodigoPostalId { get; set; }
        public required Guid FreguesiaId { get; set; }
        public required string Telefone { get; set; }
        public required string Email { get; set; }
        public required string Fax { get; set; }
    }

    public class CreateLocalizacaoValidator : AbstractValidator<CreateLocalizacaoRequest>
    {
        public CreateLocalizacaoValidator()
        {
            _ = RuleFor(x => x.Designacao).NotEmpty();
            _ = RuleFor(x => x.Morada).NotEmpty();
            _ = RuleFor(x => x.CodigoPostalId).NotEmpty();
            _ = RuleFor(x => x.FreguesiaId).NotEmpty();
            _ = RuleFor(x => x.Telefone).NotEmpty();
            _ = RuleFor(x => x.Email).NotEmpty();
            _ = RuleFor(x => x.Fax).NotEmpty();
        }
    }
}