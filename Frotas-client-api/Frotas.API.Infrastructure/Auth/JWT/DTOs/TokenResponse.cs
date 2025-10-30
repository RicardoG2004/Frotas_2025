using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Infrastructure.Auth.JWT.DTOs
{
  public class TokenResponse : IDto
  {
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
  }
}
