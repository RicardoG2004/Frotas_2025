using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.CodigoPostalService.Filters;

namespace Frotas.API.Application.Services.Base.CodigoPostalService
{
  public interface ICodigoPostalService : ITransientService
  {
    Task<Response<IEnumerable<CodigoPostalDTO>>> GetCodigosPostaisAsync(string keyword = "");
    Task<PaginatedResponse<CodigoPostalDTO>> GetCodigosPostaisPaginatedAsync(
      CodigoPostalTableFilter filter
    );
    Task<Response<CodigoPostalDTO>> GetCodigoPostalAsync(Guid id);
    Task<Response<Guid>> CreateCodigoPostalAsync(CreateCodigoPostalRequest request);
    Task<Response<Guid>> UpdateCodigoPostalAsync(UpdateCodigoPostalRequest request, Guid id);
    Task<Response<Guid>> DeleteCodigoPostalAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleCodigosPostaisAsync(IEnumerable<Guid> ids);
  }
}
