using System.Security.Claims;
using Frotas.API.Application.Common;

namespace Frotas.API.WebApi.Services
{
  public class CurrentTenantUserService : ICurrentTenantUserService
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentTenantUserService(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public void SetUser()
    {
      UserId = _httpContextAccessor?.HttpContext?.User?.FindFirstValue("uid"); // will be null on login
    }

    public string? UserId { get; set; }
  }
}
