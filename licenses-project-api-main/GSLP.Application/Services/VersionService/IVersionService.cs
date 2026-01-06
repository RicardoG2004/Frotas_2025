using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.VersionService.DTOs;

namespace GSLP.Application.Services.VersionService
{
  public interface IVersionService : ITransientService
  {
    Task<Response<VersionDTO>> GetVersionResponseAsync();
  }
}
