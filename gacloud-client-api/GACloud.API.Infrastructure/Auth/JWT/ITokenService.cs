using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Infrastructure.Auth.JWT.DTOs;

namespace GACloud.API.Infrastructure.Auth.JWT
{
  public interface ITokenService : ITransientService
  {
    Task<Response<TokenResponse>> GetTokenAsync(TokenRequest request);
    Task<Response<TokenResponse>> RefreshTokenAsync(string refreshToken);
  }
}
