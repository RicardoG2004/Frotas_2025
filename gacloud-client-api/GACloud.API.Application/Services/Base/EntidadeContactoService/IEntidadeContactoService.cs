using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeContactoService.Filters;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService
{
  public interface IEntidadeContactoService : ITransientService
  {
    Task<Response<IEnumerable<EntidadeContactoDTO>>> GetEntidadeContactosAsync(string keyword = "");
    Task<PaginatedResponse<EntidadeContactoDTO>> GetEntidadeContactosPaginatedAsync(
      EntidadeContactoTableFilter filter
    );
    Task<Response<EntidadeContactoDTO>> GetEntidadeContactoAsync(Guid id);
    Task<Response<Guid>> CreateEntidadeContactoAsync(CreateEntidadeContactoRequest request);
    Task<Response<Guid>> UpdateEntidadeContactoAsync(
      UpdateEntidadeContactoRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteEntidadeContactoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> CreateEntidadeContactoBulkAsync(
      CreateEntidadeContactoBulkRequest request
    );
    Task<Response<IEnumerable<Guid>>> UpdateEntidadeContactoBulkAsync(
      UpdateEntidadeContactoBulkRequest request
    );
    Task<Response<IEnumerable<Guid>>> UpsertEntidadeContactoBulkAsync(
      UpsertEntidadeContactoBulkRequest request
    );
  }
}
