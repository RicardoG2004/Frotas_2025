using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService
{
  public interface ISepulturaService : ITransientService
  {
    Task<Response<IEnumerable<SepulturaDTO>>> GetSepulturasAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<SepulturaDTO>> GetSepulturasPaginatedAsync(
      SepulturaTableFilter filter
    );
    Task<Response<SepulturaDTO>> GetSepulturaAsync(Guid id);
    Task<Response<Guid>> CreateSepulturaAsync(CreateSepulturaRequest request);
    Task<Response<Guid>> UpdateSepulturaAsync(
      UpdateSepulturaRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteSepulturaAsync(Guid id);
    Task<Response<Guid>> UpdateSepulturaSvgAsync(
      UpdateSepulturaSvgRequest request,
      Guid id
    );
    Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturasAsync(IEnumerable<Guid> ids);
  }
}

