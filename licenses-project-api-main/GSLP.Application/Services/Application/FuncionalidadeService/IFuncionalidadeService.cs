using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.FuncionalidadeService.DTOs;
using GSLP.Application.Services.Application.FuncionalidadeService.Filters;

namespace GSLP.Application.Services.Application.FuncionalidadeService
{
    public interface IFuncionalidadeService : ITransientService
    {
        Task<Response<IEnumerable<FuncionalidadeDTO>>> GetFuncionalidadesResponseAsync(
            string keyword = "",
            Guid? moduloId = null
        );
        Task<PaginatedResponse<FuncionalidadeDTO>> GetFuncionalidadesPaginatedResponseAsync(
            FuncionalidadeTableFilter filter
        );
        Task<Response<FuncionalidadeDTO>> GetFuncionalidadeResponseAsync(Guid id);
        Task<Response<Guid>> CreateFuncionalidadeResponseAsync(CreateFuncionalidadeRequest request);
        Task<Response<Guid>> UpdateFuncionalidadeResponseAsync(
            UpdateFuncionalidadeRequest request,
            Guid id
        );
        Task<Response<Guid>> DeleteFuncionalidadeResponseAsync(Guid id);
        Task<Response<IEnumerable<FuncionalidadeDTO>>> GetFuncionalidadesByAplicacaoResponseAsync(
            Guid aplicacaoId
        );
        Task<Response<IEnumerable<FuncionalidadeDTO>>> GetFuncionalidadesByModuloResponseAsync(
            Guid moduloId
        );
        Task<Response<List<Guid>>> DeleteFuncionalidadesAsync(List<Guid> ids);
    }
}
