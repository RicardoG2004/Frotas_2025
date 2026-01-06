using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Application.AreaService.DTOs
{
    public class AreaDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public string? Color { get; set; }
    }
}
