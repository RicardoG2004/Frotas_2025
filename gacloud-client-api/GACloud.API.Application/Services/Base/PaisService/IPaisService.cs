using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.PaisService.DTOs;
using GACloud.API.Application.Services.Base.PaisService.Filters;

namespace GACloud.API.Application.Services.Base.PaisService
{
  public interface IPaisService : ITransientService
  {
    Task<Response<IEnumerable<PaisDTO>>> GetPaisesAsync(string keyword = "");
    Task<PaginatedResponse<PaisDTO>> GetPaisesPaginatedAsync(PaisTableFilter filter);
    Task<Response<PaisDTO>> GetPaisAsync(Guid id);
    Task<Response<Guid>> CreatePaisAsync(CreatePaisRequest request);
    Task<Response<Guid>> UpdatePaisAsync(UpdatePaisRequest request, Guid id);
    Task<Response<Guid>> DeletePaisAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultiplePaisesAsync(IEnumerable<Guid> ids);
  }
}
