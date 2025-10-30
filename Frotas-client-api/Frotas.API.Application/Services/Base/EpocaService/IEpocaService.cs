using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.EpocaService.DTOs;
using Frotas.API.Application.Services.Base.EpocaService.Filters;

namespace Frotas.API.Application.Services.Base.EpocaService
{
  public interface IEpocaService : ITransientService
  {
    Task<Response<IEnumerable<EpocaDTO>>> GetEpocasAsync(string keyword = "");
    Task<PaginatedResponse<EpocaDTO>> GetEpocasPaginatedAsync(EpocaTableFilter filter);
    Task<Response<EpocaDTO>> GetEpocaAsync(Guid id);
    Task<Response<Guid>> CreateEpocaAsync(CreateEpocaRequest request);
    Task<Response<Guid>> UpdateEpocaAsync(UpdateEpocaRequest request, Guid id);
    Task<Response<Guid>> DeleteEpocaAsync(Guid id);
    Task<Response<EpocaDTO>> GetEpocaPredefinidaAsync();
    Task<Response<IEnumerable<Guid>>> DeleteMultipleEpocasAsync(IEnumerable<Guid> ids);
  }
}
