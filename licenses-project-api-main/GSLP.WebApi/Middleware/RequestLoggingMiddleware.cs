using GSLP.Application.Common.Logging;

namespace GSLP.WebApi.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppLogger _appLogger;

        public RequestLoggingMiddleware(RequestDelegate next, AppLogger appLogger)
        {
            _next = next;
            _appLogger = appLogger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            PathString route = context.Request.Path;
            string method = context.Request.Method;

            // Log incoming request
            _appLogger.LogRequest(route, method, 0, "Request started");

            // Capture the response status code after request is processed
            Stream originalBodyStream = context.Response.Body;

            // Create a new memory stream to capture the response body
            using MemoryStream memoryStream = new();
            // Assign the memory stream to Response.Body
            context.Response.Body = memoryStream;

            // Process the HTTP request
            await _next(context);

            // After the response is generated, log the status code
            _appLogger.LogRequest(route, method, context.Response.StatusCode);

            // Now we copy the memory stream back to the original response body
            // This is important to ensure the client receives the response.
            _ = memoryStream.Seek(0, SeekOrigin.Begin); // Rewind the memory stream to the beginning

            // Copy the memory stream content to the original body stream so the client gets the response
            await memoryStream.CopyToAsync(originalBodyStream);
        }
    }
}
