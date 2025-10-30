using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.Filters;

namespace Frotas.API.Application.Services.Frotas.ModeloService
{
  public interface IModeloService : ITransientService
  {
    Task<Response<IEnumerable<ModeloDTO>>> GetModelosAsync(string keyword = "");
    Task<PaginatedResponse<ModeloDTO>> GetModelosPaginatedAsync(ModeloTableFilter filter);
    Task<Response<ModeloDTO>> GetModeloAsync(Guid id);
    Task<Response<Guid>> CreateModeloAsync(CreateModeloRequest request);
    Task<Response<Guid>> UpdateModeloAsync(UpdateModeloRequest request, Guid id);
    Task<Response<Guid>> DeleteModeloAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleModelosAsync(IEnumerable<Guid> ids);
  }
}
