using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Utility;
using Frotas.API.Infrastructure.Encryption;
using Microsoft.Extensions.Primitives;

namespace Frotas.API.WebApi.Middleware
{
  public class APIKeyMiddleware(RequestDelegate next, IEncryptionService encryptionService)
  {
    private readonly RequestDelegate _next = next;
    private readonly IEncryptionService _encryptionService = encryptionService; // Inject the EncryptionService

    public async Task InvokeAsync(HttpContext context)
    {
      Response response = CreateErrorResponse();

      // Check if the request contains the "X-API-Key" header
      if (!TryGetApiKey(context.Request.Headers, out string APIKey))
      {
        response.Messages["$"] = ["A chave de API é obrigatória."];
        await WriteResponseAsync(context, StatusCodes.Status400BadRequest, response);
        return;
      }

      // Check if the APIKey is null or empty
      if (string.IsNullOrEmpty(APIKey))
      {
        // If the X-API-Key header is present but empty or null
        response.Messages["$"] = ["A chave de API não pode ser vazia."];
        await WriteResponseAsync(context, StatusCodes.Status400BadRequest, response);
        return;
      }

      // // Resolve ApplicationDbContext within the scope
      // using IServiceScope scope = context.RequestServices.CreateScope();
      // ApplicationDbContext dbContext =
      //     scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

      try
      {
        // Check if API key is valid but we don't have authorization claims
        // If the user is authenticated, you can access their claims.
        if (context.User.Identity?.IsAuthenticated == true)
        {
          // If the user is authenticated, get the "code" claim from the JWT token
          string? codeClaim = context.User?.Claims?.FirstOrDefault(c => c.Type == "code")?.Value;

          // If the claim is found, decrypt and validate it
          if (string.IsNullOrEmpty(codeClaim))
          {
            response.Messages["$"] = ["Código da chave de API não encontrado (Claim)."];
            await WriteResponseAsync(context, StatusCodes.Status401Unauthorized, response);
            return;
          }

          // Decrypt the code claim using the EncryptionService
          string decryptedCode = _encryptionService.DecryptString(codeClaim);

          // Validate the decrypted code against the expected value
          if (
            !decryptedCode.Equals(
              GSHelpers.GetSpecificChars(APIKey, [19, 11, 12, 25]),
              StringComparison.Ordinal
            )
          )
          {
            response.Messages["$"] = ["Código da chave de API inválido (Claim)."];
            await WriteResponseAsync(context, StatusCodes.Status401Unauthorized, response);
            return;
          }
        }

        // Store the API key in HttpContext.Items for access in controllers
        context.Items["APIKey"] = APIKey;

        // If the API key is valid and active, pass control to the next middleware
        await _next(context);
      }
      catch (Exception ex)
      {
        // Log the exception (optional, based on your logging preferences)
        response.Messages["$"] = [$"Ocorreu um erro ao validar a chave de API: {ex.Message}"];

        // Return a structured error response
        await WriteResponseAsync(context, StatusCodes.Status500InternalServerError, response);
      }
    }

    // Helper method to extract the API key from the request headers
    private static bool TryGetApiKey(IHeaderDictionary headers, out string APIKey)
    {
      if (
        headers.TryGetValue("X-API-Key", out StringValues APIKeyValues)
        && !string.IsNullOrEmpty(APIKeyValues)
      )
      {
        APIKey = APIKeyValues.First();
        return true;
      }
      APIKey = null;
      return false;
    }

    // Helper method to create an error response
    private static Response CreateErrorResponse()
    {
      return new Response { Status = ResponseStatus.Failure, Messages = [] };
    }

    // Helper method to write the response asynchronously
    private static async Task WriteResponseAsync(
      HttpContext context,
      int statusCode,
      Response response
    )
    {
      context.Response.StatusCode = statusCode;
      context.Response.ContentType = "application/json";
      await context.Response.WriteAsJsonAsync(response);
    }
  }
}
