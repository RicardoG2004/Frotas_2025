using Frotas.API.Application.Common.Wrapper;
using Frotas.API.WebApi.Extensions;
using Frotas.API.WebApi.Middleware;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureApplicationServices(builder.Configuration); // Register Services / CORS / Configure Identity Requirements / JWT Settings / Register DB Contexts / Image Handling, Mailer, Fluent Validation, Automapper
WebApplication app = builder.Build(); // Create the App

app.UseCors("defaultPolicy"); // CORS policy (default - allow any orgin)
app.UseHttpsRedirection();

// Permitir servir ficheiros estáticos da pasta wwwroot
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<APIKeyMiddleware>();
app.UseMiddleware<UserResolver>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapControllers();

app.MapFallback(async context =>
{
  context.Response.StatusCode = StatusCodes.Status404NotFound;
  context.Response.ContentType = "application/json";
  Response response = Response.Fail("Não encontrado");
  await context.Response.WriteAsJsonAsync(response);
});

app.Run();
