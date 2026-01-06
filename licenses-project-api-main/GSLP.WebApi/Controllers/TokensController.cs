using GSLP.Infrastructure.Auth.JWT;
using GSLP.Infrastructure.Auth.JWT.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase // tokens API controller, on login returns JWT tokens to authenticated users
    {
        private readonly ITokenService _tokenService;

        public TokensController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        #region [-- TOKENS - ROUTES --]

        [AllowAnonymous]
        [HttpPost] // get token (login) -- must provide tenant ID in header or subdomain
        public async Task<IActionResult> GetTokenResponseAsync([FromBody] TokenRequest request)
        {
            GSLP.Application.Common.Wrapper.Response<TokenResponse> response =
                await _tokenService.GetTokenResponseAsync(request);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("{refreshToken}")] // get token (login) -- must provide tenant ID in header or subdomain
        public async Task<IActionResult> RefreshTokenResponseAsync(string refreshToken)
        {
            GSLP.Application.Common.Wrapper.Response<TokenResponse> response =
                await _tokenService.RefreshTokenResponseAsync(refreshToken);
            return Ok(response);
        }

        #endregion [-- TOKENS - ROUTES --]
    }
}
