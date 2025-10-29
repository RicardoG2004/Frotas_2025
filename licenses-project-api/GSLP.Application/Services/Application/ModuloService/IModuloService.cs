using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.ModuloService.DTOs;
using GSLP.Application.Services.Application.ModuloService.Filters;

namespace GSLP.Application.Services.Application.ModuloService
{
    public interface IModuloService : ITransientService
    {
        Task<Response<IEnumerable<ModuloDTO>>> GetModulosResponseAsync(
            string keyword = "",
            Guid? aplicacaoId = null
        );
        Task<PaginatedResponse<ModuloDTO>> GetModulosPaginatedResponseAsync(
            ModuloTableFilter filter
        );
        Task<Response<ModuloDTO>> GetModuloResponseAsync(Guid id);
        Task<Response<Guid>> CreateModuloResponseAsync(CreateModuloRequest request);
        Task<Response<Guid>> UpdateModuloResponseAsync(UpdateModuloRequest request, Guid id);
        Task<Response<Guid>> DeleteModuloResponseAsync(Guid id);
        Task<Response<List<Guid>>> DeleteModulosAsync(List<Guid> ids);
    }
}
