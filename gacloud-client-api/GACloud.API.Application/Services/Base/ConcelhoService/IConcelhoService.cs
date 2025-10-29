using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.ConcelhoService.DTOs;
using GACloud.API.Application.Services.Base.ConcelhoService.Filters;

namespace GACloud.API.Application.Services.Base.ConcelhoService
{
  public interface IConcelhoService : ITransientService
  {
    Task<Response<IEnumerable<ConcelhoDTO>>> GetConcelhosAsync(string keyword = "");
    Task<PaginatedResponse<ConcelhoDTO>> GetConcelhosPaginatedAsync(ConcelhoTableFilter filter);
    Task<Response<ConcelhoDTO>> GetConcelhoAsync(Guid id);
    Task<Response<Guid>> CreateConcelhoAsync(CreateConcelhoRequest request);
    Task<Response<Guid>> UpdateConcelhoAsync(UpdateConcelhoRequest request, Guid id);
    Task<Response<Guid>> DeleteConcelhoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleConcelhosAsync(IEnumerable<Guid> ids);
  }
}
