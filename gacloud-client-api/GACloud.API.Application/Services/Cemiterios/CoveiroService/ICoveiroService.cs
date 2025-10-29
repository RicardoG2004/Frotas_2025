using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService
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
