using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.PecaService.DTOs;
using Frotas.API.Application.Services.Frotas.PecaService.Filters;

namespace Frotas.API.Application.Services.Frotas.PecaService
{
  public interface IPecaService : ITransientService
  {
    Task<Response<IEnumerable<PecaDTO>>> GetPecasAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<PecaDTO>> GetPecasPaginatedAsync(PecaTableFilter filter);
    Task<Response<PecaDTO>> GetPecaAsync(Guid id);
    Task<Response<Guid>> CreatePecaAsync(CreatePecaRequest request);
    Task<Response<Guid>> UpdatePecaAsync(UpdatePecaRequest request,Guid id);
    Task<Response<Guid>> DeletePecaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultiplePecasAsync(IEnumerable<Guid> ids);
  }
}

