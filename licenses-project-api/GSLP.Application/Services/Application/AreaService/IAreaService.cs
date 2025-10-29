using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AreaService.DTOs;
using GSLP.Application.Services.Application.AreaService.Filters;

namespace GSLP.Application.Services.Application.AreaService
{
    public interface IAreaService : ITransientService
    {
        Task<Response<IEnumerable<AreaDTO>>> GetAreasAsync(string keyword = "");
        Task<PaginatedResponse<AreaDTO>> GetAreasPaginatedAsync(AreaTableFilter filter);
        Task<Response<AreaDTO>> GetAreaAsync(Guid id);
        Task<Response<Guid>> CreateAreaAsync(CreateAreaRequest request);
        Task<Response<Guid>> UpdateAreaAsync(UpdateAreaRequest request, Guid id);
        Task<Response<Guid>> DeleteAreaAsync(Guid id);
        Task<Response<List<Guid>>> DeleteAreasAsync(List<Guid> ids);
    }
}
