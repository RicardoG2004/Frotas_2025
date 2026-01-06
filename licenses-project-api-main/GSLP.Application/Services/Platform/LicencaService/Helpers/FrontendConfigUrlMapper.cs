using GSLP.Application.Common.Constants;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Helpers
{
  public class FrontendConfigUrls
  {
    public string UrlApiHttp { get; set; } = string.Empty;
    public string UrlApiHttps { get; set; } = string.Empty;
    public string UrlAccessControlHttp { get; set; } = string.Empty;
    public string UrlAccessControlHttps { get; set; } = string.Empty;
    public string UpdaterApiUrlHttp { get; set; } = string.Empty;
    public string UpdaterApiUrlHttps { get; set; } = string.Empty;
  }

  public static class FrontendConfigUrlMapper
  {
    public static FrontendConfigUrls MapUrlsToFrontendConfig(Licenca licenca, string? aplicacaoId)
    {
      var isGslpManager = aplicacaoId == ApplicationIds.GSLP_MANAGER;
      var isUpdaterApp = aplicacaoId == ApplicationIds.UPDATER;

      if (isGslpManager)
      {
        // GSLP Manager: 4 URLs (2 API URLs + 2 Frontend URLs)
        // url1 = API HTTP, url2 = API HTTPS, url3 = Frontend HTTP, url4 = Frontend HTTPS
        return new FrontendConfigUrls
        {
          UrlApiHttp = licenca.Url1 ?? string.Empty,
          UrlApiHttps = licenca.Url2 ?? string.Empty,
          UrlAccessControlHttp = licenca.Url3 ?? licenca.Url1 ?? string.Empty,
          UrlAccessControlHttps = licenca.Url4 ?? licenca.Url2 ?? string.Empty,
          UpdaterApiUrlHttp = string.Empty,
          UpdaterApiUrlHttps = string.Empty,
        };
      }
      else if (isUpdaterApp)
      {
        // Updater: only 2 URLs (2 API URLs)
        // url1 = API HTTP, url2 = API HTTPS
        return new FrontendConfigUrls
        {
          UrlApiHttp = licenca.Url1 ?? string.Empty,
          UrlApiHttps = licenca.Url2 ?? string.Empty,
          UrlAccessControlHttp = licenca.Url1 ?? string.Empty,
          UrlAccessControlHttps = licenca.Url2 ?? string.Empty,
          UpdaterApiUrlHttp = string.Empty,
          UpdaterApiUrlHttps = string.Empty,
        };
      }
      else
      {
        // Other applications: 8 URLs (2 API + 2 Frontend + 2 Login + 2 Updater)
        // url1 = API HTTP, url2 = API HTTPS
        // url3 = Frontend HTTP, url4 = Frontend HTTPS
        // url5 = Login HTTP, url6 = Login HTTPS
        // url7 = Updater HTTP, url8 = Updater HTTPS
        return new FrontendConfigUrls
        {
          UrlApiHttp = licenca.Url1 ?? string.Empty,
          UrlApiHttps = licenca.Url2 ?? string.Empty,
          UrlAccessControlHttp = licenca.Url5 ?? licenca.Url1 ?? string.Empty,
          UrlAccessControlHttps = licenca.Url6 ?? licenca.Url2 ?? string.Empty,
          UpdaterApiUrlHttp = licenca.Url7 ?? string.Empty,
          UpdaterApiUrlHttps = licenca.Url8 ?? string.Empty,
        };
      }
    }
  }
}
