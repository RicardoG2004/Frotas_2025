using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.Filters;

namespace Frotas.API.Application.Services.Frotas.CategoriaService
{
  public interface ICategoriaService : ITransientService
  {
    Task<Response<IEnumerable<CategoriaDTO>>> GetCategoriasAsync(string keyword = "");
    Task<PaginatedResponse<CategoriaDTO>> GetCategoriasPaginatedAsync(CategoriaTableFilter filter);
    Task<Response<CategoriaDTO>> GetCategoriaAsync(Guid id);
    Task<Response<Guid>> CreateCategoriaAsync(CreateCategoriaRequest request);
    Task<Response<Guid>> UpdateCategoriaAsync(UpdateCategoriaRequest request, Guid id);
    Task<Response<Guid>> DeleteCategoriaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCategoriasAsync(IEnumerable<Guid> ids);
  }
}
