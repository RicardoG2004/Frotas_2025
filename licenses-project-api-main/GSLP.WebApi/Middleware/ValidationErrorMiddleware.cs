using System.Net;
using System.Text.Json;
using GSLP.Application.Common.Logging;
using GSLP.Application.Common.Wrapper;

namespace GSLP.WebApi.Middleware
{
    public class ValidationErrorMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppLogger _appLogger; // Inject AppLogger
        private readonly IHostEnvironment _hostEnvironment; // Inject IHostEnvironment

        public ValidationErrorMiddleware(
            RequestDelegate next,
            AppLogger appLogger,
            IHostEnvironment hostEnvironment
        )
        {
            _next = next;
            _appLogger = appLogger;
            _hostEnvironment = hostEnvironment; // Assign it to a field
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            // Save the original response body stream
            Stream originalBodyStream = httpContext.Response.Body;

            // Create a memory stream to capture the response
            using MemoryStream memoryStream = new();
            httpContext.Response.Body = memoryStream;

            try
            {
                // Proceed to the next middleware in the pipeline
                await _next(httpContext);

                // Now, rewind the memory stream before reading it
                _ = memoryStream.Seek(0, SeekOrigin.Begin);
                string responseBody = await new StreamReader(memoryStream).ReadToEndAsync();

                // // Log the response body differently based on the environment
                // if (_hostEnvironment.IsDevelopment())
                // {
                //     // Log detailed response body in development
                //     _appLogger.LogInfoWithMessage($"Corpo da resposta capturado: {responseBody}");
                // }
                // else
                // {
                //     // Log a generic validation error message in non-development environments
                //     _appLogger.LogInfoWithMessage("Resposta de erro de validação capturada");
                // }

                // Check if the response status code is a validation error (400)
                if (httpContext.Response.StatusCode == (int)HttpStatusCode.BadRequest)
                {
                    // Attempt to parse the response body as JSON to check for the errors
                    try
                    {
                        JsonDocument responseJson = JsonDocument.Parse(responseBody);

                        // Check if the response contains "errors" property
                        if (
                            responseJson.RootElement.TryGetProperty(
                                "errors",
                                out JsonElement errors
                            )
                        )
                        {
                            Response customResponse = new()
                            {
                                Succeeded = false,
                                Messages = _hostEnvironment.IsDevelopment()
                                    ? FormatValidationErrors(errors) // Include detailed errors in development
                                    : new Dictionary<string, List<string>>
                                    {
                                        {
                                            "$",
                                            new List<string>
                                            {
                                                "Houve um problema ao processar os dados fornecidos.",
                                            }
                                        }, // Generic message in non-development
                                    },
                            };

                            // Rewind memoryStream to write the custom error response
                            memoryStream.SetLength(0); // Clear previous data
                            httpContext.Response.ContentType = "application/json";
                            httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                            // Serialize and write the custom response to memory stream
                            await JsonSerializer.SerializeAsync(memoryStream, customResponse);

                            // Rewind memoryStream to ensure the response is read from the beginning
                            _ = memoryStream.Seek(0, SeekOrigin.Begin);

                            // Write the response to the original output stream
                            await memoryStream.CopyToAsync(originalBodyStream);
                            await httpContext.Response.Body.FlushAsync();
                            return; // End here to stop further processing
                        }
                    }
                    catch (JsonException ex)
                    {
                        // Use LogWarningWithException to log the message and the exception
                        _appLogger.LogWarningWithException(
                            $"Resposta JSON inválida detectada: {ex.Message}",
                            ex
                        );
                    }
                }

                // If the status code is not 400 (BadRequest), forward the original response
                _ = memoryStream.Seek(0, SeekOrigin.Begin);
                await memoryStream.CopyToAsync(originalBodyStream);
                await httpContext.Response.Body.FlushAsync();
            }
            catch (Exception ex)
            {
                _appLogger.LogErrorWithException(
                    $"Erro inesperado ao processar a resposta de erro de validação: {ex.Message}",
                    ex
                );
                throw;
            }
        }

        private static Dictionary<string, List<string>> FormatValidationErrors(JsonElement errors)
        {
            Dictionary<string, List<string>> errorMessages = new();

            // Loop through each error in the "errors" object and format the message
            foreach (JsonProperty error in errors.EnumerateObject())
            {
                string fieldName = error.Name; // The field name (e.g., "$", "field1", etc.)
                List<string> messages = [];

                foreach (JsonElement message in error.Value.EnumerateArray())
                {
                    messages.Add(message.GetString()); // Add each error message for this field
                }

                errorMessages[fieldName] = messages; // Add to dictionary
            }

            return errorMessages;
        }
    }
}
