using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.FseService.DTOs
{
    public class UpdateFseRequest : IDto
    {
        public required string Nome { get; set; }
        public required string NumContribuinte { get; set; }
        public string? Morada { get; set; }
        public Guid? CodigoPostalId { get; set; }
        public Guid? PaisId { get; set; }
        public string? Contacto { get; set; }
        public required string Telefone { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? EnderecoHttp { get; set; }
        public string? Origem { get; set; }
    }

    public class UpdateFseValidator : AbstractValidator<UpdateFseRequest>
    {
        public UpdateFseValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.NumContribuinte).NotEmpty();
            _ = RuleFor(x => x.Telefone).NotEmpty();
        }
    }
}