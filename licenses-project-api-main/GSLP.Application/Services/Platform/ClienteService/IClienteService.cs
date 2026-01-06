using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.ClienteService.DTOs;
using GSLP.Application.Services.Platform.ClienteService.Filters;

namespace GSLP.Application.Services.Platform.ClienteService
{
    public interface IClienteService : ITransientService
    {
        #region [-- ICLIENTE - API METHODS --]

        Task<Response<IEnumerable<ClienteDTO>>> GetClientesResponseAsync(string keyword = "");
        Task<PaginatedResponse<ClienteDTO>> GetClientesPaginatedResponseAsync(
            ClienteTableFilter filter
        );
        Task<Response<ClienteDTO>> GetClienteResponseAsync(Guid id);
        Task<Response<Guid>> CreateClienteResponseAsync(CreateClienteRequest request);
        Task<Response<Guid>> UpdateClienteResponseAsync(UpdateClienteRequest request, Guid id);
        Task<Response<Guid>> DeleteClienteResponseAsync(Guid id);
        Task<Response<ClienteDTO>> GetClienteByLicencaResponseAsync(Guid licencaId);
        Task<Response<List<Guid>>> DeleteClientesAsync(List<Guid> ids);
        Task<Response<IEnumerable<ClienteDTO>>> GetClientesByAplicacaoResponseAsync(Guid aplicacaoId);

        #endregion [-- ICLIENTE - API METHODS --]
    }
}
