using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.DelegacaoService.Filters;

namespace Frotas.API.Application.Services.Base.DelegacaoService
{
  public interface IDelegacaoService : ITransientService
  {
    Task<Response<IEnumerable<DelegacaoDTO>>> GetDelegacoesAsync(string keyword = "");
    Task<PaginatedResponse<DelegacaoDTO>> GetDelegacoesPaginatedAsync(DelegacaoTableFilter filter);
    Task<Response<DelegacaoDTO>> GetDelegacaoAsync(Guid id);
    Task<Response<Guid>> CreateDelegacaoAsync(CreateDelegacaoRequest request);
    Task<Response<Guid>> UpdateDelegacaoAsync(UpdateDelegacaoRequest request, Guid id);
    Task<Response<Guid>> DeleteDelegacaoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleDelegacoesAsync(IEnumerable<Guid> ids);
  }
}