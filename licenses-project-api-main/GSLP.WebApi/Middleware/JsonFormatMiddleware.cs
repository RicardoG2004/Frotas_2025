using System.Net;
using System.Text.Json;
using GSLP.Application.Common.Logging;
using GSLP.Application.Common.Wrapper;

namespace GSLP.WebApi.Middleware
{
    public class JsonFormatMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppLogger _appLogger; // Inject AppLogger

        public JsonFormatMiddleware(RequestDelegate next, AppLogger appLogger)
        {
            _next = next;
            _appLogger = appLogger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            // Check if the request content type is JSON
            if (
                httpContext.Request.ContentType != null
                && httpContext.Request.ContentType.Contains("application/json")
            )
            {
                // Save the original body stream
                Stream originalBodyStream = httpContext.Request.Body;
                MemoryStream memoryStream = new();

                try
                {
                    // Copy the request body into the memory stream to validate the JSON
                    await originalBodyStream.CopyToAsync(memoryStream);
                    _ = memoryStream.Seek(0, SeekOrigin.Begin); // Rewind the memory stream

                    try
                    {
                        // Attempt to deserialize the JSON to detect malformed JSON
                        byte[] buffer = memoryStream.ToArray(); // Get the buffered bytes
                        _ = JsonDocument.Parse(buffer); // This will throw if the JSON is invalid

                        // Rewind the memory stream to allow future reads from the original stream
                        _ = memoryStream.Seek(0, SeekOrigin.Begin);
                        httpContext.Request.Body = memoryStream; // Reassign the buffered stream to the request body
                    }
                    catch (JsonException jsonEx)
                    {
                        // Log the malformed JSON with AppLogger
                        _appLogger.LogWarningWithException(
                            $"JSON malformado detectado: {jsonEx.Message}",
                            jsonEx
                        );

                        // Return a BadRequest (400) response with the custom message
                        Response response = Response.Fail(
                            "O corpo da requisição não é um JSON válido."
                        );

                        // Set status and content type for BadRequest
                        httpContext.Response.ContentType = "application/json";
                        httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                        // Write the response and return
                        await httpContext.Response.WriteAsJsonAsync(response);

                        return; // Exit the middleware pipeline if JSON is malformed
                    }
                }
                catch (Exception ex)
                {
                    // Log the unexpected error using AppLogger with a dynamic message
                    _appLogger.LogErrorWithException(
                        "Erro inesperado ao processar o corpo da requisição",
                        ex
                    );
                }
            }

            // Continue to the next middleware if the JSON is valid or content is not JSON
            await _next(httpContext);
        }
    }
}
