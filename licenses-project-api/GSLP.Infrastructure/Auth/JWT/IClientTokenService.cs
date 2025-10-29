using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Infrastructure.Auth.JWT.DTOs;

namespace GSLP.Infrastructure.Auth.JWT
{
    public interface IClientTokenService : ITransientService
    {
        Task<Response<ClientTokenResponse>> GetClientTokenAsync(ClientTokenRequest request);
        Task<Response<ClientTokenResponse>> RefreshClientTokenAsync(string refreshToken);
    }
}
