using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaAPIKeyService;
using GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Platform
{
    [Route("api/keys")]
    [ApiController]
    public class LicencasAPIKeysController : ControllerBase
    {
        private readonly ILicencaAPIKeyService _LicencaAPIKeyService;

        public LicencasAPIKeysController(ILicencaAPIKeyService LicencaAPIKeyService)
        {
            _LicencaAPIKeyService = LicencaAPIKeyService;
        }

        #region [-- LICENCAAPIKEY - ROUTES --]

        // add LicencaAPIKey to licenca
        [Authorize(Roles = "root, administrator")]
        [HttpPost("{licencaId}/create")]
        public async Task<IActionResult> CreateLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            Response<Guid> result = await _LicencaAPIKeyService.CreateLicencaAPIKeyResponseAsync(
                licencaId
            );
            return Ok(result);
        }

        // Set LicencaAPIKey status (active or inactive)
        [Authorize(Roles = "root, administrator")]
        [HttpPost("{licencaId}/set-status")]
        public async Task<IActionResult> SetLicencaAPIKeyStatusResponseAsync(
            Guid licencaId,
            [FromBody] SetLicencaAPIKeyStatusRequest request
        )
        {
            Response<Guid> result = await _LicencaAPIKeyService.SetLicencaAPIKeyStatusResponseAsync(
                licencaId,
                request
            );
            return Ok(result);
        }

        // Regenerate LicencaAPIKey
        [Authorize(Roles = "root, administrator")]
        [HttpPut("{licencaId}/regenerate")]
        public async Task<IActionResult> RegenerateLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            Response<Guid> result =
                await _LicencaAPIKeyService.RegenerateLicencaAPIKeyResponseAsync(licencaId);
            return Ok(result);
        }

        // Get LicencaAPIKey by licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("{licencaId}")]
        public async Task<IActionResult> GetLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            Response<LicencaAPIKeyDTO> result =
                await _LicencaAPIKeyService.GetLicencaAPIKeyResponseAsync(licencaId);
            return Ok(result);
        }

        #endregion [-- LICENCAAPIKEY - ROUTES --]
    }
}
