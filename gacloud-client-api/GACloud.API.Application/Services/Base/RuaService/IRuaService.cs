using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RuaService.DTOs;
using GACloud.API.Application.Services.Base.RuaService.Filters;

namespace GACloud.API.Application.Services.Base.RuaService
{
  public interface IRuaService : ITransientService
  {
    Task<Response<IEnumerable<RuaDTO>>> GetRuasAsync(string keyword = "");
    Task<PaginatedResponse<RuaDTO>> GetRuasPaginatedAsync(RuaTableFilter filter);
    Task<Response<RuaDTO>> GetRuaAsync(Guid id);
    Task<Response<Guid>> CreateRuaAsync(CreateRuaRequest request);
    Task<Response<Guid>> UpdateRuaAsync(UpdateRuaRequest request, Guid id);
    Task<Response<Guid>> DeleteRuaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleRuasAsync(IEnumerable<Guid> ids);
  }
}
