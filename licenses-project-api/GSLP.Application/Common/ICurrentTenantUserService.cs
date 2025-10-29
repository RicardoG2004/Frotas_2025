using GSLP.Application.Common.Marker;

namespace GSLP.Application.Common
{
    public interface ICurrentTenantUserService : IScopedService
    {
        public void SetUser();
        string? UserId { get; set; }
    }
}
