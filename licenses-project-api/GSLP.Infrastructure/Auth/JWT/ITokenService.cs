using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Infrastructure.Auth.JWT.DTOs;

namespace GSLP.Infrastructure.Auth.JWT
{
    public interface ITokenService : ITransientService
    {
        Task<Response<TokenResponse>> GetTokenResponseAsync(TokenRequest request);
        Task<Response<TokenResponse>> RefreshTokenResponseAsync(string refreshToken);
    }
}
