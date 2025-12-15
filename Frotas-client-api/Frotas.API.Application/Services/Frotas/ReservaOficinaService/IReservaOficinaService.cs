using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.Filters;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService
{
  public interface IReservaOficinaService : ITransientService
  {
    Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<ReservaOficinaDTO>> GetReservasOficinaPaginatedAsync(ReservaOficinaTableFilter filter);
    Task<Response<ReservaOficinaDTO>> GetReservaOficinaAsync(Guid id);
    Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaByFuncionarioAsync(Guid funcionarioId);
    Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaByDateAsync(DateTime dataReserva);
    Task<Response<Guid>> CreateReservaOficinaAsync(CreateReservaOficinaRequest request);
    Task<Response<Guid>> UpdateReservaOficinaAsync(UpdateReservaOficinaRequest request, Guid id);
    Task<Response<Guid>> DeleteReservaOficinaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleReservasOficinaAsync(IEnumerable<Guid> ids);
  }
}

