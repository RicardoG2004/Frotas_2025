using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CargoService.DTOs;
using Frotas.API.Application.Services.Base.CargoService.Filters;

namespace Frotas.API.Application.Services.Base. CargoService
{
  public interface ICargoService : ITransientService
  {
    Task<Response<IEnumerable<CargoDTO>>> GetCargosAsync(string keyword = "");
    Task<PaginatedResponse<CargoDTO>> GetCargosPaginatedAsync(CargoTableFilter filter);
    Task<Response<CargoDTO>> GetCargoAsync(Guid id);
    Task<Response<Guid>> CreateCargoAsync(CreateCargoRequest request);
    Task<Response<Guid>> UpdateCargoAsync(UpdateCargoRequest request, Guid id);
    Task<Response<Guid>> DeleteCargoAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCargosAsync(IEnumerable<Guid> ids);
  }
}