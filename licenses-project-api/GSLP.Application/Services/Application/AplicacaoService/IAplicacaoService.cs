using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Application.AplicacaoService.Filters;

namespace GSLP.Application.Services.Application.AplicacaoService
{
    public interface IAplicacaoService : ITransientService
    {
        Task<Response<IEnumerable<AplicacaoDTO>>> GetAplicacoesResponseAsync(string keyword = "");
        Task<PaginatedResponse<AplicacaoDTO>> GetAplicacoesPaginatedResponseAsync(
            AplicacaoTableFilter filter
        );
        Task<Response<AplicacaoDTO>> GetAplicacaoResponseAsync(Guid id);
        Task<Response<Guid>> CreateAplicacaoResponseAsync(CreateAplicacaoRequest request);
        Task<Response<Guid>> UpdateAplicacaoResponseAsync(UpdateAplicacaoRequest request, Guid id);
        Task<Response<Guid>> DeleteAplicacaoResponseAsync(Guid id);
        Task<Response<List<Guid>>> DeleteAplicacoesAsync(List<Guid> ids);
    }
}
