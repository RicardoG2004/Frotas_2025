using GSLP.Application.Common.Marker;

namespace GSLP.Infrastructure.Auth.JWT.DTOs
{
    public class TokenResponse : IDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public UserBaseDataDTO Data { get; set; }
    }
}
