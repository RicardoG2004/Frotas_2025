using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaModuloService.DTOs
{
    public class LicencaModuloNomeDTO : IDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public Guid AplicacaoId { get; set; }
    }
}
