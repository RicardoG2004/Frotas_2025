using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.Filters;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService
{
  public interface IAbastecimentoService : ITransientService
  {
    Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<AbastecimentoDTO>> GetAbastecimentosPaginatedAsync(AbastecimentoTableFilter filter);
    Task<Response<AbastecimentoDTO>> GetAbastecimentoAsync(Guid id);
    Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosByFuncionarioAsync(Guid funcionarioId);
    Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosByDateAsync(DateTime data);
    Task<Response<Guid>> CreateAbastecimentoAsync(CreateAbastecimentoRequest request);
    Task<Response<Guid>> UpdateAbastecimentoAsync(UpdateAbastecimentoRequest request, Guid id);
    Task<Response<Guid>> DeleteAbastecimentoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleAbastecimentosAsync(IEnumerable<Guid> ids);
  }
}

