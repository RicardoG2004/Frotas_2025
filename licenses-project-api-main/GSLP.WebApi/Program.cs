using GSLP.Application.Common.Wrapper;
using GSLP.WebApi.Extensions;
using GSLP.WebApi.Middleware;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureApplicationServices(builder.Configuration);
WebApplication app = builder.Build();

app.UseCors("defaultPolicy");

// HTTPS redirection disabled to support both HTTP and HTTPS protocols
// If you want to redirect HTTP to HTTPS, configure it at IIS level instead
// app.UseHttpsRedirection();

app.UseRouting();

// app.UseDefaultFiles();  // enables serving static files from wwwroot folder (react client - index.html)
// app.UseStaticFiles();   // enables the application to serve static files (like CSS, JavaScript, images, etc.)
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<RequestLoggingMiddleware>();

// Register your custom middlewares
app.UseMiddleware<JsonFormatMiddleware>(); // Handles malformed JSON (Request)
app.UseMiddleware<ValidationErrorMiddleware>(); // Handles Validation Errors in Response

// Rate limiting middleware - should be early in pipeline to prevent abuse
app.UseMiddleware<RateLimitingMiddleware>();

app.UseMiddleware<APIKeyMiddleware>();
app.UseMiddleware<UserResolver>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Directly map your API controllers
app.MapControllers(); // This maps API controllers to their respective routes

// Register fallback route to serve the index.html for SPA
// app.MapFallbackToController("Index", "Fallback");  // Directs unmatched routes to the Index action in FallbackController

// Handle unmatched routes with a 404 JSON response (No HTML served)
app.MapFallback(async context =>
{
  context.Response.StatusCode = StatusCodes.Status404NotFound;
  context.Response.ContentType = "application/json";
  Response response = Response.Fail("Não encontrado");
  await context.Response.WriteAsJsonAsync(response);
});

app.Run();
