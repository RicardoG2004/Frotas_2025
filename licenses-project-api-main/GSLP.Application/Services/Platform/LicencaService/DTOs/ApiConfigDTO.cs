using System.Text.Json.Serialization;
using GSLP.Application.Common.Marker;

namespace GSLP.Application.Services.Platform.LicencaService.DTOs
{
  public class ApiConfigDTO : IDto
  {
    [JsonPropertyName("ConnectionStrings")]
    public ConnectionStringsConfigDTO ConnectionStrings { get; set; } = new();

    [JsonPropertyName("Logging")]
    public LoggingConfigDTO Logging { get; set; } = new();

    [JsonPropertyName("AllowedHosts")]
    public string AllowedHosts { get; set; } = "*";

    [JsonPropertyName("JWTSettings")]
    public JwtSettingsConfigDTO JWTSettings { get; set; } = new();

    [JsonPropertyName("MailSettings")]
    public MailSettingsConfigDTO MailSettings { get; set; } = new();

    [JsonPropertyName("Cloudinary")]
    public CloudinaryConfigDTO Cloudinary { get; set; } = new();

    [JsonPropertyName("EncryptionSettings")]
    public EncryptionSettingsConfigDTO EncryptionSettings { get; set; } = new();

    [JsonPropertyName("RateLimiting")]
    public RateLimitingConfigDTO RateLimiting { get; set; } = new();
  }

  public class ConnectionStringsConfigDTO
  {
    [JsonPropertyName("DefaultConnection")]
    public string DefaultConnection { get; set; } = string.Empty;
  }

  public class LoggingConfigDTO
  {
    [JsonPropertyName("LogLevel")]
    public LogLevelConfigDTO LogLevel { get; set; } = new();
  }

  public class LogLevelConfigDTO
  {
    [JsonPropertyName("Default")]
    public string Default { get; set; } = "Information";

    [JsonPropertyName("Microsoft.AspNetCore")]
    public string MicrosoftAspNetCore { get; set; } = "Warning";
  }

  public class JwtSettingsConfigDTO
  {
    [JsonPropertyName("Key")]
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("Issuer")]
    public string Issuer { get; set; } = string.Empty;

    [JsonPropertyName("Audience")]
    public string Audience { get; set; } = string.Empty;

    [JsonPropertyName("AuthTokenDurationInMinutes")]
    public int AuthTokenDurationInMinutes { get; set; }

    [JsonPropertyName("RefreshTokenDurationInDays")]
    public int RefreshTokenDurationInDays { get; set; }
  }

  public class MailSettingsConfigDTO
  {
    [JsonPropertyName("DisplayName")]
    public string DisplayName { get; set; } = string.Empty;

    [JsonPropertyName("From")]
    public string From { get; set; } = string.Empty;

    [JsonPropertyName("Host")]
    public string Host { get; set; } = string.Empty;

    [JsonPropertyName("Password")]
    public string Password { get; set; } = string.Empty;

    [JsonPropertyName("Port")]
    public int Port { get; set; }

    [JsonPropertyName("UserName")]
    public string UserName { get; set; } = string.Empty;
  }

  public class CloudinaryConfigDTO
  {
    [JsonPropertyName("CloudName")]
    public string CloudName { get; set; } = string.Empty;

    [JsonPropertyName("ApiKey")]
    public string ApiKey { get; set; } = string.Empty;

    [JsonPropertyName("ApiSecret")]
    public string ApiSecret { get; set; } = string.Empty;

    [JsonPropertyName("ApiBaseAddress")]
    public string ApiBaseAddress { get; set; } = string.Empty;
  }

  public class EncryptionSettingsConfigDTO
  {
    [JsonPropertyName("EncryptionKey")]
    public string EncryptionKey { get; set; } = string.Empty;
  }

  public class RateLimitingConfigDTO
  {
    [JsonPropertyName("MaxRequests")]
    public int MaxRequests { get; set; }

    [JsonPropertyName("WindowSeconds")]
    public int WindowSeconds { get; set; }

    [JsonPropertyName("ExcludedPaths")]
    public string[] ExcludedPaths { get; set; } = Array.Empty<string>();
  }
}

