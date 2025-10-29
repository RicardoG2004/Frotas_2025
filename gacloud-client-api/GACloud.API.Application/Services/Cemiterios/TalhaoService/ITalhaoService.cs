using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService
{
  public interface ITalhaoService : ITransientService
  {
    Task<Response<IEnumerable<TalhaoDTO>>> GetTalhoesAsync(
      string keyword = "",
      string? cemiterioId = null
    );
    Task<PaginatedResponse<TalhaoDTO>> GetTalhoesPaginatedAsync(
      TalhaoTableFilter filter
    );
    Task<Response<TalhaoDTO>> GetTalhaoAsync(Guid id);
    Task<Response<Guid>> CreateTalhaoAsync(CreateTalhaoRequest request);
    Task<Response<Guid>> UpdateTalhaoAsync(UpdateTalhaoRequest request, Guid id);
    Task<Response<Guid>> DeleteTalhaoAsync(Guid id);
    Task<Response<Guid>> UpdateTalhaoSvgAsync(
      UpdateTalhaoSvgRequest request,
      Guid id
    );
    Task<Response<IEnumerable<Guid>>> DeleteMultipleTalhoesAsync(IEnumerable<Guid> ids);
  }
}

