using System.Text.Json;
using System.Text.Json.Serialization;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.VersionService.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace GSLP.Application.Services.VersionService
{
  public class VersionService : IVersionService
  {
    private readonly IHostEnvironment _env;
    private readonly IConfiguration _configuration;

    public VersionService(IHostEnvironment env, IConfiguration configuration)
    {
      _env = env;
      _configuration = configuration;
    }

    public async Task<Response<VersionDTO>> GetVersionResponseAsync()
    {
      try
      {
        // Get WebRootPath - construct from ContentRootPath + "wwwroot"
        string webRootPath = Path.Combine(_env.ContentRootPath, "wwwroot");

        // Validate WebRootPath exists
        if (string.IsNullOrEmpty(webRootPath) || !Directory.Exists(webRootPath))
        {
          return Response<VersionDTO>.Fail("Erro de configuração");
        }

        // Construct the version file path - explicitly use only "version.json" to prevent path traversal
        string versionPath = Path.Combine(webRootPath, "version.json");

        // Security: Ensure the resolved path is still within WebRootPath (prevent path traversal attacks)
        string normalizedWebRoot = Path.GetFullPath(webRootPath)
          .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
        string normalizedVersionPath = Path.GetFullPath(versionPath)
          .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);

        if (
          !normalizedVersionPath.StartsWith(normalizedWebRoot, StringComparison.OrdinalIgnoreCase)
        )
        {
          // Path traversal attempt detected
          return Response<VersionDTO>.Fail("Erro de configuração");
        }

        if (!System.IO.File.Exists(versionPath))
        {
          return Response<VersionDTO>.Fail("Ficheiro de versão não encontrado");
        }

        string versionJson = await System.IO.File.ReadAllTextAsync(versionPath);
        VersionData? versionData = JsonSerializer.Deserialize<VersionData>(versionJson);

        if (versionData == null || string.IsNullOrEmpty(versionData.ApiVersion))
        {
          return Response<VersionDTO>.Fail("Formato do ficheiro de versão inválido");
        }

        // Sanitize version strings to prevent injection (only allow alphanumeric, dots, and hyphens)
        string sanitizedApiVersion = SanitizeVersionString(versionData.ApiVersion);
        if (string.IsNullOrEmpty(sanitizedApiVersion))
        {
          return Response<VersionDTO>.Fail("Formato do ficheiro de versão inválido");
        }

        // Optionally, you can also read the frontend version from a config
        string appVersionRaw = _configuration["AppVersion"] ?? sanitizedApiVersion;
        string sanitizedAppVersion = SanitizeVersionString(appVersionRaw) ?? sanitizedApiVersion;

        var versionDto = new VersionDTO
        {
          AppVersion = sanitizedAppVersion,
          ApiVersion = sanitizedApiVersion,
        };

        return Response<VersionDTO>.Success(versionDto);
      }
      catch (UnauthorizedAccessException)
      {
        // Don't expose file system access errors
        return Response<VersionDTO>.Fail("Erro de configuração");
      }
      catch (System.IO.DirectoryNotFoundException)
      {
        return Response<VersionDTO>.Fail("Erro de configuração");
      }
      catch (Exception ex)
      {
        // Don't expose internal error details to prevent information leakage
        return Response<VersionDTO>.Fail("Erro interno do servidor");
      }
    }

    /// <summary>
    /// Sanitizes version string to prevent injection attacks.
    /// Only allows alphanumeric characters, dots, and hyphens.
    /// </summary>
    private static string? SanitizeVersionString(string? version)
    {
      if (string.IsNullOrWhiteSpace(version))
        return null;

      // Only allow alphanumeric, dots, and hyphens (standard semantic versioning format)
      string sanitized = new string(
        version.Where(c => char.IsLetterOrDigit(c) || c == '.' || c == '-').ToArray()
      );

      // Ensure it's not empty and has reasonable length (max 50 chars for version string)
      if (string.IsNullOrWhiteSpace(sanitized) || sanitized.Length > 50)
        return null;

      return sanitized;
    }
  }

  internal class VersionData
  {
    [JsonPropertyName("apiVersion")]
    public string ApiVersion { get; set; } = string.Empty;
  }
}
