using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.FuncionarioService.DTOs
{
    public class DeleteMultipleFuncionarioRequest : IDto
    {
        public required IEnumerable<Guid> Ids { get; set; }
    }
}