using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService
{
  public interface ICemiterioService : ITransientService
  {
    Task<Response<IEnumerable<CemiterioDTO>>> GetCemiteriosAsync(string keyword = "");
    Task<PaginatedResponse<CemiterioDTO>> GetCemiteriosPaginatedAsync(CemiterioTableFilter filter);
    Task<Response<CemiterioDTO>> GetCemiterioAsync(Guid id);
    Task<Response<Guid>> CreateCemiterioAsync(CreateCemiterioRequest request);
    Task<Response<Guid>> UpdateCemiterioAsync(UpdateCemiterioRequest request, Guid id);
    Task<Response<Guid>> DeleteCemiterioAsync(Guid id);
    Task<Response<string>> UploadCemiterioSvgAsync(UploadCemiterioSvgRequest request);
    Task<Response<CemiterioDTO>> GetCemiterioPredefinidoAsync();
    Task<Response<string>> GetCemiterioSvgAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCemiteriosAsync(IEnumerable<Guid> ids);
  }
}

