using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.CargoService.DTOs
{
    public class CargoDTO : IDto
    {
        public Guid Id { get; set; }
        public required string Designacao { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}