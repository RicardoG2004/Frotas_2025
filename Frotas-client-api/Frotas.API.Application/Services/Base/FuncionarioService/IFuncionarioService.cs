using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FuncionarioService.Filters;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;

namespace Frotas.API.Application.Services.Base.FuncionarioService
{
  public interface IFuncionarioService : ITransientService
  {
    Task<Response<IEnumerable<FuncionarioDTO>>> GetFuncionariosAsync(string keyword = "");
    Task<PaginatedResponse<FuncionarioDTO>> GetFuncionariosPaginatedAsync(FuncionarioTableFilter filter);
    Task<Response<FuncionarioDTO>> GetFuncionarioAsync(Guid id);
    Task<Response<Guid>> CreateFuncionarioAsync(CreateFuncionarioRequest request);
    Task<Response<Guid>> UpdateFuncionarioAsync(UpdateFuncionarioRequest request, Guid id);
    Task<Response<Guid>> DeleteFuncionarioAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleFuncionariosAsync(IEnumerable<Guid> ids);
  }
}


