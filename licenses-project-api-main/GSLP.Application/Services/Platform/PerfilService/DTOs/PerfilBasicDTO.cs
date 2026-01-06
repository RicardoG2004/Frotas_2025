using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.PerfilService.DTOs
{
    public class PerfilBasicDTO : IDto
    {
        public string? Id { get; set; }
        public string? Nome { get; set; }
        public bool? Ativo { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? LicencaId { get; set; }
    }
}
