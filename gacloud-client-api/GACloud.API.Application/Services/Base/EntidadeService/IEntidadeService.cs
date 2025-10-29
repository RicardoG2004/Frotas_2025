using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EntidadeService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeService.Filters;

namespace GACloud.API.Application.Services.Base.EntidadeService
{
  public interface IEntidadeService : ITransientService
  {
    Task<Response<IEnumerable<EntidadeDTO>>> GetEntidadesAsync(string keyword = "");
    Task<PaginatedResponse<EntidadeDTO>> GetEntidadesPaginatedAsync(EntidadeTableFilter filter);
    Task<Response<EntidadeDTO>> GetEntidadeAsync(Guid id);
    Task<Response<Guid>> CreateEntidadeAsync(CreateEntidadeRequest request);
    Task<Response<Guid>> UpdateEntidadeAsync(UpdateEntidadeRequest request, Guid id);
    Task<Response<Guid>> DeleteEntidadeAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleEntidadesAsync(IEnumerable<Guid> ids);
  }
}
