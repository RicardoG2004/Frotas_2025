using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.TerceiroService.DTOs
{
    public class UpdateTerceiroRequest : IDto
    {
        public required string Nome { get; set; }
        public required string NIF { get; set; }
        public required string Morada { get; set; }
        public required Guid CodigoPostalId { get; set; }
    }

    public class UpdateTerceiroValidator : AbstractValidator<UpdateTerceiroRequest>
    {
        public UpdateTerceiroValidator()
        {
            _ = RuleFor(x => x.Nome).NotEmpty();
            _ = RuleFor(x => x.NIF).NotEmpty();
            _ = RuleFor(x => x.Morada).NotEmpty();
            _ = RuleFor(x => x.CodigoPostalId).NotEmpty();
        }
    }
}