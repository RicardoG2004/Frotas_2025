using System.Text.Json.Serialization;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
  public class UpdaterConfigurationDTO : IDto
  {
    public LoggingDTO Logging { get; set; } = new();
    public string AllowedHosts { get; set; } = "*";
    public UpdaterSectionDTO Updater { get; set; } = new();
  }

  public class LoggingDTO
  {
    public LogLevelDTO LogLevel { get; set; } = new();
  }

  public class LogLevelDTO
  {
    public string Default { get; set; } = "Information";

    [JsonPropertyName("Microsoft.AspNetCore")]
    public string MicrosoftAspNetCore { get; set; } = "Warning";
  }

  public class UpdaterSectionDTO
  {
    public LicensesApiDTO LicensesApi { get; set; } = new();
    public List<UpdaterClientDTO> Clients { get; set; } = [];
    public SecurityDTO Security { get; set; } = new();
    public BackupDTO Backup { get; set; } = new();
    public CleanupDTO Cleanup { get; set; } = new();
  }

  public class LicensesApiDTO
  {
    public string BaseUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
  }

  public class UpdaterClientDTO
  {
    public string LicenseId { get; set; } = string.Empty;
    public string? FrontendPath { get; set; }
    public string? ApiPath { get; set; }
    public UpdaterIisDTO? Iis { get; set; }
  }

  public class UpdaterIisDTO
  {
    public string? ApiPoolName { get; set; }
    public string? FrontendPoolName { get; set; }
  }

  public class SecurityDTO
  {
    public string ApiKey { get; set; } = string.Empty;
    public List<string> AllowedIpAddresses { get; set; } = new() { "127.0.0.1", "::1" };
  }

  public class BackupDTO
  {
    public bool Enabled { get; set; } = true;
    public int RetentionCount { get; set; } = 3;
  }

  public class CleanupDTO
  {
    public bool CleanBeforeCopy { get; set; } = true;
  }
}
