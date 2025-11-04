using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.Filters;

namespace Frotas.API.Application.Services.Base.SetorService
{
  public interface ISetorService : ITransientService
  {
    Task<Response<IEnumerable<SetorDTO>>> GetSetoresAsync(string keyword = "");
    Task<PaginatedResponse<SetorDTO>> GetSetoresPaginatedAsync(SetorTableFilter filter);
    Task<Response<SetorDTO>> GetSetorAsync(Guid id);
    Task<Response<Guid>> CreateSetorAsync(CreateSetorRequest request);
    Task<Response<Guid>> UpdateSetorAsync(UpdateSetorRequest request, Guid id);
    Task<Response<Guid>> DeleteSetorAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSetoresAsync(IEnumerable<Guid> ids);
  }
}