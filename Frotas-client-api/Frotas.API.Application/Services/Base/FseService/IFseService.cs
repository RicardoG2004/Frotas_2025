using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FseService.DTOs;
using Frotas.API.Application.Services.Base.FseService.Filters;

namespace Frotas.API.Application.Services.Base.FseService
{
    public interface IFseService : ITransientService
    {
        Task<Response<IEnumerable<FseDTO>>> GetFsesAsync(string keyword = "");
        Task<PaginatedResponse<FseDTO>> GetFsesPaginatedAsync(FseTableFilter filter);
        Task<Response<FseDTO>> GetFseAsync(Guid id);
        Task<Response<Guid>> CreateFseAsync(CreateFseRequest request);
        Task<Response<Guid>> UpdateFseAsync(UpdateFseRequest request, Guid id);
        Task<Response<Guid>> DeleteFseAsync(Guid id);
        Task<Response<IEnumerable<Guid>>> DeleteMultipleFsesAsync(IEnumerable<Guid> ids);
    }
}