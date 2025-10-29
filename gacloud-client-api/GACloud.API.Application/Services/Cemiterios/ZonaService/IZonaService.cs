using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ZonaService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService
{
  public interface IZonaService : ITransientService
  {
    Task<Response<IEnumerable<ZonaDTO>>> GetZonasAsync(
      string keyword = "",
      string? cemiterioId = null
    );
    Task<PaginatedResponse<ZonaDTO>> GetZonasPaginatedAsync(
      ZonaTableFilter filter
    );
    Task<Response<ZonaDTO>> GetZonaAsync(Guid id);
    Task<Response<Guid>> CreateZonaAsync(CreateZonaRequest request);
    Task<Response<Guid>> UpdateZonaAsync(UpdateZonaRequest request, Guid id);
    Task<Response<Guid>> DeleteZonaAsync(Guid id);
    Task<Response<Guid>> UpdateZonaSvgAsync(
      UpdateZonaSvgRequest request,
      Guid id
    );
    Task<Response<IEnumerable<Guid>>> DeleteMultipleZonasAsync(IEnumerable<Guid> ids);
  }
}

