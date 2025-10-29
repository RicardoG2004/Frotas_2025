using GACloud.API.Application.Common;
using GACloud.API.Infrastructure.Persistence.Contexts;

namespace GACloud.API.WebApi.Middleware
{
  public class UserResolver
  {
    private readonly RequestDelegate _next;

    public UserResolver(RequestDelegate next)
    {
      _next = next;
    }

    public async Task InvokeAsync(
      HttpContext context,
      ICurrentTenantUserService currentUserService,
      IWebHostEnvironment env,
      ApplicationDbContext dbContext
    )
    {
      // Set the current user ID from the ICurrentTenantUserService into the ApplicationDbContext
      currentUserService.SetUser();
      dbContext.SetCurrentUserId(currentUserService.UserId);

      // Proceed with the request
      await _next(context);
    }
  }
}
