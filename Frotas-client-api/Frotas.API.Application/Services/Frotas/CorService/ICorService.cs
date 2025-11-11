using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CorService.DTOs;
using Frotas.API.Application.Services.Frotas.CorService.Filters;

namespace Frotas.API.Application.Services.Frotas.CorService
{
  public interface ICorService : ITransientService
  {
    Task<Response<IEnumerable<CorDTO>>> GetCoresAsync(string keyword = "");
    Task<PaginatedResponse<CorDTO>> GetCoresPaginatedAsync(CorTableFilter filter);
    Task<Response<CorDTO>> GetCorAsync(Guid id);
    Task<Response<Guid>> CreateCorAsync(CreateCorRequest request);
    Task<Response<Guid>> UpdateCorAsync(UpdateCorRequest request, Guid id);
    Task<Response<Guid>> DeleteCorAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCoresAsync(IEnumerable<Guid> ids);
  }
}


