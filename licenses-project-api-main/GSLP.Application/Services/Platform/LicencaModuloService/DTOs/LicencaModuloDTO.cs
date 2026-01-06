using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaModuloService.DTOs
{
    public class LicencaModuloDTO : IDto
    {
        public string? LicencaId { get; set; }
        public string? ModuloId { get; set; }
    }
}
