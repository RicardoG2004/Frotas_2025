using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.Filters;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService
{
  public interface IEquipamentoService : ITransientService
  {
    Task<Response<IEnumerable<EquipamentoDTO>>> GetEquipamentosAsync(
      string keyword = ""
    );
    Task<PaginatedResponse<EquipamentoDTO>> GetEquipamentosPaginatedAsync(EquipamentoTableFilter filter);
    Task<Response<EquipamentoDTO>> GetEquipamentoAsync(Guid id);
    Task<Response<Guid>> CreateEquipamentoAsync(CreateEquipamentoRequest request);
    Task<Response<Guid>> UpdateEquipamentoAsync(UpdateEquipamentoRequest request,Guid id);
    Task<Response<Guid>> DeleteEquipamentoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleEquipamentosAsync(IEnumerable<Guid> ids);
  }
}

