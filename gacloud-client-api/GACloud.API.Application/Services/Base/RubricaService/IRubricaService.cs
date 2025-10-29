using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RubricaService.DTOs;
using GACloud.API.Application.Services.Base.RubricaService.Filters;

namespace GACloud.API.Application.Services.Base.RubricaService
{
  public interface IRubricaService : ITransientService
  {
    Task<Response<IEnumerable<RubricaDTO>>> GetRubricasAsync(
      string keyword = "",
      string? epocaId = null
    );
    Task<PaginatedResponse<RubricaDTO>> GetRubricasPaginatedAsync(RubricaTableFilter filter);
    Task<Response<RubricaDTO>> GetRubricaAsync(Guid id);
    Task<Response<Guid>> CreateRubricaAsync(CreateRubricaRequest request);
    Task<Response<Guid>> UpdateRubricaAsync(UpdateRubricaRequest request, Guid id);
    Task<Response<Guid>> DeleteRubricaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleRubricasAsync(IEnumerable<Guid> ids);
  }
}
