using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService
{
  public interface IDefuntoTipoService : ITransientService
  {
    Task<Response<IEnumerable<DefuntoTipoDTO>>> GetDefuntoTiposAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<DefuntoTipoDTO>> GetDefuntoTiposPaginatedAsync(
      DefuntoTipoTableFilter filter
    );
    Task<Response<DefuntoTipoDTO>> GetDefuntoTipoAsync(Guid id);
    Task<Response<Guid>> CreateDefuntoTipoAsync(CreateDefuntoTipoRequest request);
    Task<Response<Guid>> UpdateDefuntoTipoAsync(
      UpdateDefuntoTipoRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteDefuntoTipoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleDefuntoTiposAsync(
      IEnumerable<Guid> ids
    );
  }
}

