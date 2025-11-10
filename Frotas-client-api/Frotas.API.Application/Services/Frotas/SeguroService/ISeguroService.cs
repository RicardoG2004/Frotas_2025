using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguroService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguroService.Filters;

namespace Frotas.API.Application.Services.Frotas.SeguroService
{
  public interface ISeguroService : ITransientService
  {
    Task<Response<IEnumerable<SeguroDTO>>> GetSegurosAsync(string keyword = "");
    Task<PaginatedResponse<SeguroDTO>> GetSegurosPaginatedAsync(SeguroTableFilter filter);
    Task<Response<SeguroDTO>> GetSeguroAsync(Guid id);
    Task<Response<Guid>> CreateSeguroAsync(CreateSeguroRequest request);
    Task<Response<Guid>> UpdateSeguroAsync(UpdateSeguroRequest request, Guid id);
    Task<Response<Guid>> DeleteSeguroAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSegurosAsync(IEnumerable<Guid> ids);
  }
}

