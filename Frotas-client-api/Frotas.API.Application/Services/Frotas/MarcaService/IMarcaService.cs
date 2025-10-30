using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;
using Frotas.API.Application.Services.Frotas.MarcaService.Filters;

namespace Frotas.API.Application.Services.Frotas.MarcaService
{
  public interface IMarcaService : ITransientService
  {
    Task<Response<IEnumerable<MarcaDTO>>> GetMarcasAsync(string keyword = "");
    Task<PaginatedResponse<MarcaDTO>> GetMarcasPaginatedAsync(MarcaTableFilter filter);
    Task<Response<MarcaDTO>> GetMarcaAsync(Guid id);
    Task<Response<Guid>> CreateMarcaAsync(CreateMarcaRequest request);
    Task<Response<Guid>> UpdateMarcaAsync(UpdateMarcaRequest request, Guid id);
    Task<Response<Guid>> DeleteMarcaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleMarcasAsync(IEnumerable<Guid> ids);
  }
}
