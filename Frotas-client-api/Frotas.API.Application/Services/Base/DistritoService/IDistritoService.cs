using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;
using Frotas.API.Application.Services.Base.DistritoService.Filters;

namespace Frotas.API.Application.Services.Base.DistritoService
{
  public interface IDistritoService : ITransientService
  {
    Task<Response<IEnumerable<DistritoDTO>>> GetDistritosAsync(string keyword = "");
    Task<PaginatedResponse<DistritoDTO>> GetDistritosPaginatedAsync(DistritoTableFilter filter);
    Task<Response<DistritoDTO>> GetDistritoAsync(Guid id);
    Task<Response<Guid>> CreateDistritoAsync(CreateDistritoRequest request);
    Task<Response<Guid>> UpdateDistritoAsync(UpdateDistritoRequest request, Guid id);
    Task<Response<Guid>> DeleteDistritoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleDistritosAsync(IEnumerable<Guid> ids);
  }
}
