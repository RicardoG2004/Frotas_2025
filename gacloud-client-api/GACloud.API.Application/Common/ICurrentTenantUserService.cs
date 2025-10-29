using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Common
{
  public interface ICurrentTenantUserService : IScopedService
  {
    public void SetUser();
    string? UserId { get; set; }
  }
}
