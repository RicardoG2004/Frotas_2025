using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs
{
    public class LicencaAPIKeyDTO : IDto
    {
        public string? APIKey { get; set; }
        public bool? Ativo { get; set; }
    }
}
