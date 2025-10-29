using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.FreguesiaService.DTOs;
using GACloud.API.Application.Services.Base.FreguesiaService.Filters;

namespace GACloud.API.Application.Services.Base.FreguesiaService
{
  public interface IFreguesiaService : ITransientService
  {
    Task<Response<IEnumerable<FreguesiaDTO>>> GetFreguesiasAsync(string keyword = "");
    Task<PaginatedResponse<FreguesiaDTO>> GetFreguesiasPaginatedAsync(FreguesiaTableFilter filter);
    Task<Response<FreguesiaDTO>> GetFreguesiaAsync(Guid id);
    Task<Response<Guid>> CreateFreguesiaAsync(CreateFreguesiaRequest request);
    Task<Response<Guid>> UpdateFreguesiaAsync(UpdateFreguesiaRequest request, Guid id);
    Task<Response<Guid>> DeleteFreguesiaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleFreguesiasAsync(IEnumerable<Guid> ids);
  }
}
