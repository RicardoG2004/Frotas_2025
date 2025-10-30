using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Common
{
  public interface ICurrentTenantUserService : IScopedService
  {
    public void SetUser();
    string? UserId { get; set; }
  }
}
