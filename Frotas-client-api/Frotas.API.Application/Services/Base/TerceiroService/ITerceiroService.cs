using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TerceiroService.DTOs;
using Frotas.API.Application.Services.Base.TerceiroService.Filters;

namespace Frotas.API.Application.Services.Base.TerceiroService
{
  public interface ITerceiroService : ITransientService
  {
    Task<Response<IEnumerable<TerceiroDTO>>> GetTerceirosAsync(string keyword = "");
    Task<PaginatedResponse<TerceiroDTO>> GetTerceirosPaginatedAsync(TerceiroTableFilter filter);
    Task<Response<TerceiroDTO>> GetTerceiroAsync(Guid id);
    Task<Response<Guid>> CreateTerceiroAsync(CreateTerceiroRequest request);
    Task<Response<Guid>> UpdateTerceiroAsync(UpdateTerceiroRequest request, Guid id);
    Task<Response<Guid>> DeleteTerceiroAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleTerceirosAsync(IEnumerable<Guid> ids);
  }
}