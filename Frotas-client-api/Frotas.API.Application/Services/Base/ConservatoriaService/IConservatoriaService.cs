using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.ConservatoriaService.DTOs;
using Frotas.API.Application.Services.Base.ConservatoriaService.Filters;

namespace Frotas.API.Application.Services.Base.ConservatoriaService
{
  public interface IConservatoriaService : ITransientService
  {
    Task<Response<IEnumerable<ConservatoriaDTO>>> GetConservatoriasAsync(string keyword = "");
    Task<PaginatedResponse<ConservatoriaDTO>> GetConservatoriasPaginatedAsync(ConservatoriaTableFilter filter);
    Task<Response<ConservatoriaDTO>> GetConservatoriaAsync(Guid id);
    Task<Response<Guid>> CreateConservatoriaAsync(CreateConservatoriaRequest request);
    Task<Response<Guid>> UpdateConservatoriaAsync(UpdateConservatoriaRequest request, Guid id);
    Task<Response<Guid>> DeleteConservatoriaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleConservatoriasAsync(IEnumerable<Guid> ids);
  }
}