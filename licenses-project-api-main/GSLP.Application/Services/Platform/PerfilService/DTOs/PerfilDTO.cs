using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.LicencaService.DTOs;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class PerfilDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
        public LicencaDTO Licenca { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
