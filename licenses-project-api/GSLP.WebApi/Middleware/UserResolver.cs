using GSLP.Application.Common;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.WebApi.Middleware
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
