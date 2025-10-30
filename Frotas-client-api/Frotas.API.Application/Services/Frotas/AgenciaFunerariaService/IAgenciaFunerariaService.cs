using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.DTOs;
using Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.Filters;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService
{
  public interface IAgenciaFunerariaService : ITransientService
  {
    Task<Response<IEnumerable<AgenciaFunerariaDTO>>> GetAgenciasFunerariasAsync(
      string keyword = ""
    );
    Task<
      PaginatedResponse<AgenciaFunerariaDTO>
    > GetAgenciasFunerariasPaginatedAsync(AgenciaFunerariaTableFilter filter);
    Task<Response<AgenciaFunerariaDTO>> GetAgenciaFunerariaAsync(Guid id);
    Task<Response<Guid>> CreateAgenciaFunerariaAsync(
      CreateAgenciaFunerariaRequest request
    );
    Task<Response<Guid>> UpdateAgenciaFunerariaAsync(
      UpdateAgenciaFunerariaRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteAgenciaFunerariaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleAgenciasFunerariasAsync(
      IEnumerable<Guid> ids
    );
  }
}

