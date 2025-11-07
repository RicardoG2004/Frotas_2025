using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.GarantiaService.DTOs;
using Frotas.API.Application.Services.Base.GarantiaService.Filters;

namespace Frotas.API.Application.Services.Base.GarantiaService
{
    public interface IGarantiaService : ITransientService
    {
    Task<Response<IEnumerable<GarantiaDTO>>> GetGarantiasAsync(string keyword = "");
    Task<PaginatedResponse<GarantiaDTO>> GetGarantiasPaginatedAsync(GarantiaTableFilter filter);
    Task<Response<GarantiaDTO>> GetGarantiaAsync(Guid id);
    Task<Response<Guid>> CreateGarantiaAsync(CreateGarantiaRequest request);
    Task<Response<Guid>> UpdateGarantiaAsync(UpdateGarantiaRequest request, Guid id);
    Task<Response<Guid>> DeleteGarantiaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleGarantiasAsync(IEnumerable<Guid> ids);
    }
}