using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CorService.DTOs;
using Frotas.API.Application.Services.Base.CorService.Filters;

namespace Frotas.API.Application.Services.Base.CorService
{
  public interface ICorService : ITransientService
  {
    Task<Response<IEnumerable<CorDTO>>> GetCorsAsync(string keyword = "");
    Task<PaginatedResponse<CorDTO>> GetCorsPaginatedAsync(CorTableFilter filter);
    Task<Response<CorDTO>> GetCorAsync(Guid id);
    Task<Response<Guid>> CreateCorAsync(CreateCorRequest request);
    Task<Response<Guid>> UpdateCorAsync(UpdateCorRequest request, Guid id);
    Task<Response<Guid>> DeleteCorAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCorsAsync(IEnumerable<Guid> ids);
  }
}
