using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService
{
  public interface ISepulturaTipoService : ITransientService
  {
    Task<Response<IEnumerable<SepulturaTipoDTO>>> GetSepulturaTiposAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<SepulturaTipoDTO>> GetSepulturaTiposPaginatedAsync(
      SepulturaTipoTableFilter filter
    );
    Task<Response<SepulturaTipoDTO>> GetSepulturaTipoAsync(Guid id);
    Task<Response<Guid>> CreateSepulturaTipoAsync(
      CreateSepulturaTipoRequest request
    );
    Task<Response<Guid>> UpdateSepulturaTipoAsync(
      UpdateSepulturaTipoRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteSepulturaTipoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturaTiposAsync(
      IEnumerable<Guid> ids
    );
  }
}

