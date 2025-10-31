using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.Filters;

namespace Frotas.API.Application.Services.Frotas.CombustivelService
{
  public interface ICombustivelService : ITransientService
  {
    Task<Response<IEnumerable<CombustivelDTO>>> GetCombustiveisAsync(string keyword = "");
    Task<PaginatedResponse<CombustivelDTO>> GetCombustiveisPaginatedAsync(CombustivelTableFilter filter);
    Task<Response<CombustivelDTO>> GetCombustivelAsync(Guid id);
    Task<Response<Guid>> CreateCombustivelAsync(CreateCombustivelRequest request);
    Task<Response<Guid>> UpdateCombustivelAsync(UpdateCombustivelRequest request, Guid id);
    Task<Response<Guid>> DeleteCombustivelAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCombustiveisAsync(IEnumerable<Guid> ids);
  }
}
