using GSLP.Infrastructure.Auth.JWT;
using GSLP.Infrastructure.Auth.JWT.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers
{
    [AllowAnonymous]
    [Route("api/client-token")]
    [ApiController]
    public class ClientTokenController : ControllerBase
    {
        private readonly IClientTokenService _clientTokenService;

        public ClientTokenController(IClientTokenService clientTokenService)
        {
            _clientTokenService = clientTokenService;
        }

        [HttpPost]
        public async Task<IActionResult> GetClientTokenAsync([FromBody] ClientTokenRequest request)
        {
            var response = await _clientTokenService.GetClientTokenAsync(request);
            return Ok(response);
        }

        [HttpGet("refresh/{refreshToken}")]
        public async Task<IActionResult> RefreshClientTokenAsync(string refreshToken)
        {
            var response = await _clientTokenService.RefreshClientTokenAsync(refreshToken);
            return Ok(response);
        }
    }
}
