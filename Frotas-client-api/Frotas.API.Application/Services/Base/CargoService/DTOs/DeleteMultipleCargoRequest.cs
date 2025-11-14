using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.CargoService.DTOs
{
    public class DeleteMultipleCargoRequest : IDto
    {
        public required IEnumerable<Guid> Ids { get; set; }
    }
}