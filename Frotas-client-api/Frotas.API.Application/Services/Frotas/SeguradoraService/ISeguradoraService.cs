using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguradoraService.Filters;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService
{
  public interface ISeguradoraService : ITransientService
  {
    Task<Response<IEnumerable<SeguradoraDTO>>> GetSeguradorasAsync(string keyword = "");
    Task<PaginatedResponse<SeguradoraDTO>> GetSeguradorasPaginatedAsync(SeguradoraTableFilter filter);
    Task<Response<SeguradoraDTO>> GetSeguradoraAsync(Guid id);
    Task<Response<Guid>> CreateSeguradoraAsync(CreateSeguradoraRequest request);
    Task<Response<Guid>> UpdateSeguradoraAsync(UpdateSeguradoraRequest request, Guid id);
    Task<Response<Guid>> DeleteSeguradoraAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSeguradorasAsync(IEnumerable<Guid> ids);
  }
}

