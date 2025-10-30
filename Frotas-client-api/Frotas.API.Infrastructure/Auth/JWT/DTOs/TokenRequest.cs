using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Infrastructure.Auth.JWT.DTOs
{
  public class TokenRequest : IDto
  {
    // tenant key in header
    public string Email { get; set; }
    public string Password { get; set; }
  }
}
