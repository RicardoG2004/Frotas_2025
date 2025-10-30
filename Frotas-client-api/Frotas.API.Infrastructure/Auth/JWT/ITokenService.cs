using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Infrastructure.Auth.JWT.DTOs;

namespace Frotas.API.Infrastructure.Auth.JWT
{
  public interface ITokenService : ITransientService
  {
    Task<Response<TokenResponse>> GetTokenAsync(TokenRequest request);
    Task<Response<TokenResponse>> RefreshTokenAsync(string refreshToken);
  }
}
