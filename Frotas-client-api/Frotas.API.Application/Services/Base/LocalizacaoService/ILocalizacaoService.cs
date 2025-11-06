using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.LocalizacaoService.DTOs;
using Frotas.API.Application.Services.Base.LocalizacaoService.Filters;

namespace Frotas.API.Application.Services.Base.LocalizacaoService
{
  public interface ILocalizacaoService : ITransientService
  {
    Task<Response<IEnumerable<LocalizacaoDTO>>> GetLocalizacoesAsync(string keyword = "");
    Task<PaginatedResponse<LocalizacaoDTO>> GetLocalizacoesPaginatedAsync(LocalizacaoTableFilter filter);
    Task<Response<LocalizacaoDTO>> GetLocalizacaoAsync(Guid id);
    Task<Response<Guid>> CreateLocalizacaoAsync(CreateLocalizacaoRequest request);
    Task<Response<Guid>> UpdateLocalizacaoAsync(UpdateLocalizacaoRequest request, Guid id);
    Task<Response<Guid>> DeleteLocalizacaoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleLocalizacoesAsync(IEnumerable<Guid> ids);
  }
}