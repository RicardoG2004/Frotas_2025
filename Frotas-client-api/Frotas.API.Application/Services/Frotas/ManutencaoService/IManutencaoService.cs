using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs;
using Frotas.API.Application.Services.Frotas.ManutencaoService.Filters;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService
{
  public interface IManutencaoService : ITransientService
  {
    Task<Response<IEnumerable<ManutencaoDTO>>> GetManutencoesAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<ManutencaoDTO>> GetManutencoesPaginatedAsync(ManutencaoTableFilter filter);
    Task<Response<ManutencaoDTO>> GetManutencaoAsync(Guid id);
    Task<Response<Guid>> CreateManutencaoAsync(CreateManutencaoRequest request);
    Task<Response<Guid>> UpdateManutencaoAsync(UpdateManutencaoRequest request, Guid id);
    Task<Response<Guid>> DeleteManutencaoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleManutencoesAsync(IEnumerable<Guid> ids);
  }
}

