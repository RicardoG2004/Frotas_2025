using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.VersionService;
using GSLP.Application.Services.VersionService.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class VersionController : ControllerBase
  {
    private readonly IVersionService _versionService;

    public VersionController(IVersionService versionService)
    {
      _versionService = versionService;
    }

    /// <summary>
    /// Gets the API and application version information.
    /// This is a read-only, public endpoint that requires only API key validation.
    /// </summary>
    /// <returns>Version information including appVersion and apiVersion</returns>
    [HttpGet]
    [HttpHead] // Support HEAD requests for health checks
    [AllowAnonymous] // Endpoint is accessible without authentication
    public async Task<IActionResult> GetVersionResponseAsync()
    {
      Response<VersionDTO> result = await _versionService.GetVersionResponseAsync();
      return Ok(result);
    }
  }
}
