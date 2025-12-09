using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.FseService.DTOs
{
    public class DeleteMultipleFseRequest : IDto
    {
        public IEnumerable<Guid> Ids { get; set; } = [];
    }
}