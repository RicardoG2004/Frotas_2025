using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
  public class FrontendConfigDTO : IDto
  {
    public string ApiKey { get; set; } = string.Empty;
    public string UrlApiHttp { get; set; } = string.Empty;
    public string UrlApiHttps { get; set; } = string.Empty;
    public string UrlAccessControlHttp { get; set; } = string.Empty;
    public string UrlAccessControlHttps { get; set; } = string.Empty;
    public string UpdaterApiUrlHttp { get; set; } = string.Empty;
    public string UpdaterApiUrlHttps { get; set; } = string.Empty;
    public string UpdaterApiKey { get; set; } = string.Empty;
    public string ClientKey { get; set; } = string.Empty;
    public string LicencaId { get; set; } = string.Empty;
    public string EncryptionKey { get; set; } = string.Empty;
  }
}

