using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.DTOs;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.Filters;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService
{
  public interface IUtilizacaoService : ITransientService
  {
    Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<UtilizacaoDTO>> GetUtilizacoesPaginatedAsync(UtilizacaoTableFilter filter);
    Task<Response<UtilizacaoDTO>> GetUtilizacaoAsync(Guid id);
    Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesByFuncionarioAsync(Guid funcionarioId);
    Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesByDateAsync(DateTime dataUtilizacao);
    Task<Response<Guid>> CreateUtilizacaoAsync(CreateUtilizacaoRequest request);
    Task<Response<Guid>> UpdateUtilizacaoAsync(UpdateUtilizacaoRequest request, Guid id);
    Task<Response<Guid>> DeleteUtilizacaoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleUtilizacoesAsync(IEnumerable<Guid> ids);
  }
}

