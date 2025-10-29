using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService
{
  public interface ISepulturaTipoDescricaoService : ITransientService
  {
    Task<
      Response<IEnumerable<SepulturaTipoDescricaoDTO>>
    > GetSepulturaTiposDescricaoAsync(string keyword = "");
    Task<
      PaginatedResponse<SepulturaTipoDescricaoDTO>
    > GetSepulturaTiposDescricaoPaginatedAsync(
      SepulturaTipoDescricaoTableFilter filter
    );
    Task<Response<SepulturaTipoDescricaoDTO>> GetSepulturaTipoDescricaoAsync(
      Guid id
    );
    Task<Response<Guid>> CreateSepulturaTipoDescricaoAsync(
      CreateSepulturaTipoDescricaoRequest request
    );
    Task<Response<Guid>> UpdateSepulturaTipoDescricaoAsync(
      UpdateSepulturaTipoDescricaoRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteSepulturaTipoDescricaoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturaTipoDescricoesAsync(IEnumerable<Guid> ids);
  }
}

