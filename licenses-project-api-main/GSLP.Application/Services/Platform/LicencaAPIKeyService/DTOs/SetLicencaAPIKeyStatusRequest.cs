using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs
{
    public class SetLicencaAPIKeyStatusRequest : IDto
    {
        public bool IsActive { get; set; }
    }
}
