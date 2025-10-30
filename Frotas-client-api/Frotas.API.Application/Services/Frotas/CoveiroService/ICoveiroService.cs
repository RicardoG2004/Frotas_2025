using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CoveiroService.DTOs;
using Frotas.API.Application.Services.Frotas.CoveiroService.Filters;

namespace Frotas.API.Application.Services.Frotas.CoveiroService
{
  public interface ICoveiroService : ITransientService
  {
    Task<Response<IEnumerable<CoveiroDTO>>> GetCoveirosAsync(string keyword = "");
    Task<PaginatedResponse<CoveiroDTO>> GetCoveirosPaginatedAsync(CoveiroTableFilter filter);
    Task<Response<CoveiroDTO>> GetCoveiroAsync(Guid id);
    Task<Response<Guid>> CreateCoveiroAsync(CreateCoveiroRequest request);
    Task<Response<Guid>> UpdateCoveiroAsync(UpdateCoveiroRequest request, Guid id);
    Task<Response<Guid>> DeleteCoveiroAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCoveirosAsync(IEnumerable<Guid> ids);
  }
}
