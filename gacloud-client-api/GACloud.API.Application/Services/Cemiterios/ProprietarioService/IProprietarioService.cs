using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.Filters;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService
{
  public interface IProprietarioService : ITransientService
  {
    Task<Response<IEnumerable<ProprietarioDTO>>> GetProprietariosAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<ProprietarioDTO>> GetProprietariosAsync(
      ProprietarioTableFilter filter
    );
    Task<Response<ProprietarioDTO>> GetProprietarioByIdAsync(Guid id);
    Task<Response<Guid>> CreateProprietarioAsync(
      CreateProprietarioRequest request
    );
    Task<Response<Guid>> UpdateProprietarioAsync(
      UpdateProprietarioRequest request,
      Guid id
    );
    Task<Response<Guid>> DeleteProprietarioAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleProprietariosAsync(IEnumerable<Guid> ids);
  }
}

