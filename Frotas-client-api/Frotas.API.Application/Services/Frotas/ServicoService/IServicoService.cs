using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.Filters;

namespace Frotas.API.Application.Services.Frotas.ServicoService
{
  public interface IServicoService : ITransientService
  {
    Task<Response<IEnumerable<ServicoDTO>>> GetServicosAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<ServicoDTO>> GetServicosPaginatedAsync(ServicoTableFilter filter);
    Task<Response<ServicoDTO>> GetServicoAsync(Guid id);
    Task<Response<Guid>> CreateServicoAsync(CreateServicoRequest request);
    Task<Response<Guid>> UpdateServicoAsync(UpdateServicoRequest request,Guid id);
    Task<Response<Guid>> DeleteServicoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleServicosAsync(IEnumerable<Guid> ids);
  }
}

