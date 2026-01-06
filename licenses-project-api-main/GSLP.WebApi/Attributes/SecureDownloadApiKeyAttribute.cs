using GSLP.Application.Common.Wrapper;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GSLP.WebApi.Attributes
{
  /// <summary>
  /// Custom authorization attribute that validates API keys against the database
  /// Validates that the API key exists, is active, and is associated with an active, non-blocked license
  /// </summary>
  public class SecureDownloadApiKeyAttribute : Attribute, IAsyncAuthorizationFilter
  {
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
      // Get logger from service provider
      ILogger<SecureDownloadApiKeyAttribute> logger =
        context.HttpContext.RequestServices.GetRequiredService<
          ILogger<SecureDownloadApiKeyAttribute>
        >();

      // Log incoming request details
      string requestMethod = context.HttpContext.Request.Method;
      string requestPath = context.HttpContext.Request.Path;
      string? clientIp = context.HttpContext.Connection.RemoteIpAddress?.ToString();

      logger.LogInformation(
        "[SecureDownloadApiKey] Incoming request - Method: {Method}, Path: {Path}, ClientIP: {ClientIP}",
        requestMethod,
        requestPath,
        clientIp ?? "Unknown"
      );

      // Check if the request contains the "X-API-Key" header
      if (!context.HttpContext.Request.Headers.TryGetValue("X-API-Key", out var apiKeyHeader))
      {
        logger.LogWarning(
          "[SecureDownloadApiKey] Request rejected - Missing API key header. Method: {Method}, Path: {Path}, ClientIP: {ClientIP}",
          requestMethod,
          requestPath,
          clientIp ?? "Unknown"
        );

        context.Result = new JsonResult(
          Response.Fail("A chave de API é obrigatória para acessar este recurso.")
        )
        {
          StatusCode = StatusCodes.Status401Unauthorized,
        };
        return;
      }

      string providedApiKey = apiKeyHeader.ToString();

      // Log the API key being used (for debugging purposes)
      logger.LogInformation(
        "[SecureDownloadApiKey] API Key received - Method: {Method}, Path: {Path}, APIKey: {APIKey}",
        requestMethod,
        requestPath,
        providedApiKey
      );

      // Primary validation: Check if the API key exists in the database FIRST
      // This ensures we validate against the actual license data, not just configuration
      using IServiceScope scope = context.HttpContext.RequestServices.CreateScope();
      ApplicationDbContext dbContext =
        scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

      try
      {
        // Query the LicencaAPIKey table to check if the APIKey exists and is active
        Domain.Entities.Catalog.Platform.LicencaAPIKey? licencaAPIKey = await dbContext
          .LicencasAPIKeys.Include(k => k.Licenca) // Include Licenca to check its status
          .ThenInclude(k => k.Cliente) // Include Cliente
          .FirstOrDefaultAsync(k => k.APIKey == providedApiKey);

        // If the API key is not found in the database, deny access immediately
        // Database is the single source of truth - no whitelist validation
        if (licencaAPIKey == null)
        {
          logger.LogWarning(
            "[SecureDownloadApiKey] Request rejected - API key not found in database. Method: {Method}, Path: {Path}, APIKey: {APIKey}, ClientIP: {ClientIP}",
            requestMethod,
            requestPath,
            providedApiKey,
            clientIp ?? "Unknown"
          );

          context.Result = new JsonResult(Response.Fail("Chave de API não encontrada no sistema."))
          {
            StatusCode = StatusCodes.Status401Unauthorized,
          };
          return;
        }

        // Check if the LicencaAPIKey itself is active
        if (!licencaAPIKey.Ativo)
        {
          logger.LogWarning(
            "[SecureDownloadApiKey] Request rejected - API key is inactive. Method: {Method}, Path: {Path}, APIKey: {APIKey}, LicencaId: {LicencaId}, ClientIP: {ClientIP}",
            requestMethod,
            requestPath,
            providedApiKey,
            licencaAPIKey.LicencaId,
            clientIp ?? "Unknown"
          );

          context.Result = new JsonResult(Response.Fail("Chave de API desativada."))
          {
            StatusCode = StatusCodes.Status403Forbidden,
          };
          return;
        }

        // Check if the license exists and is active
        if (licencaAPIKey.Licenca == null || !licencaAPIKey.Licenca.Ativo)
        {
          logger.LogWarning(
            "[SecureDownloadApiKey] Request rejected - License is inactive or missing. Method: {Method}, Path: {Path}, APIKey: {APIKey}, LicencaId: {LicencaId}, ClientIP: {ClientIP}",
            requestMethod,
            requestPath,
            providedApiKey,
            licencaAPIKey.LicencaId,
            clientIp ?? "Unknown"
          );

          context.Result = new JsonResult(
            Response.Fail("A chave de API está associada a uma licença desativada ou inexistente.")
          )
          {
            StatusCode = StatusCodes.Status403Forbidden,
          };
          return;
        }

        // Check if the license is blocked
        if (licencaAPIKey.Licenca.Bloqueada)
        {
          logger.LogWarning(
            "[SecureDownloadApiKey] Request rejected - License is blocked. Method: {Method}, Path: {Path}, APIKey: {APIKey}, LicencaId: {LicencaId}, MotivoBloqueio: {MotivoBloqueio}, ClientIP: {ClientIP}",
            requestMethod,
            requestPath,
            providedApiKey,
            licencaAPIKey.LicencaId,
            licencaAPIKey.Licenca.MotivoBloqueio ?? "N/A",
            clientIp ?? "Unknown"
          );

          context.Result = new JsonResult(
            Response.Fail(
              $"A chave de API está associada a uma licença bloqueada.{(string.IsNullOrEmpty(licencaAPIKey.Licenca.MotivoBloqueio) ? "" : $" Motivo: {licencaAPIKey.Licenca.MotivoBloqueio}")}"
            )
          )
          {
            StatusCode = StatusCodes.Status403Forbidden,
          };
          return;
        }

        // API key is valid, active, and associated with an active, non-blocked license
        // Store the validated API key in HttpContext for potential use in the controller
        context.HttpContext.Items["SecureDownloadApiKey"] = providedApiKey;
        context.HttpContext.Items["ClienteId"] = licencaAPIKey.Licenca.ClienteId;
        context.HttpContext.Items["LicencaId"] = licencaAPIKey.Licenca.Id;

        // Log successful validation
        logger.LogInformation(
          "[SecureDownloadApiKey] Request authorized - Method: {Method}, Path: {Path}, APIKey: {APIKey}, LicencaId: {LicencaId}, ClienteId: {ClienteId}, ClientIP: {ClientIP}",
          requestMethod,
          requestPath,
          providedApiKey,
          licencaAPIKey.Licenca.Id,
          licencaAPIKey.Licenca.ClienteId,
          clientIp ?? "Unknown"
        );
      }
      catch (Exception ex)
      {
        logger.LogError(
          ex,
          "[SecureDownloadApiKey] Error validating API key - Method: {Method}, Path: {Path}, APIKey: {APIKey}, ClientIP: {ClientIP}, Error: {ErrorMessage}",
          requestMethod,
          requestPath,
          providedApiKey,
          clientIp ?? "Unknown",
          ex.Message
        );

        context.Result = new JsonResult(
          Response.Fail($"Ocorreu um erro ao validar a chave de API: {ex.Message}")
        )
        {
          StatusCode = StatusCodes.Status500InternalServerError,
        };
      }
    }
  }
}
