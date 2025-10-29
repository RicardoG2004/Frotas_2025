using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ZonaService;
using GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ZonaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/zonas")]
  [ApiController]
  public class ZonasController(IZonaService ZonaService) : ControllerBase
  {
    private readonly IZonaService _ZonaService = ZonaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetZonasAsync(
      string keyword = "",
      string? cemiterioId = null
    )
    {
      Response<IEnumerable<ZonaDTO>> result =
        await _ZonaService.GetZonasAsync(keyword, cemiterioId);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetZonasPaginatedAsync(
      ZonaTableFilter filter
    )
    {
      PaginatedResponse<ZonaDTO> result =
        await _ZonaService.GetZonasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetZonaAsync(Guid id)
    {
      Response<ZonaDTO> result = await _ZonaService.GetZonaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateZonaAsync(CreateZonaRequest request)
    {
      try
      {
        Response<Guid> result = await _ZonaService.CreateZonaAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateZonaAsync(
      UpdateZonaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _ZonaService.UpdateZonaAsync(request, id);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // delete
    [Authorize(Roles = "client")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteZonaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _ZonaService.DeleteZonaAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpPatch("{id}/svg")]
    public async Task<IActionResult> UpdateSvg(Guid id, UpdateZonaSvgRequest request)
    {
      return Ok(await _ZonaService.UpdateZonaSvgAsync(request, id));
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleZonasAsync(
      [FromBody] DeleteMultipleZonaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ZonaService.DeleteMultipleZonasAsync(request.Ids);

        // Frontend can now differentiate between response types:
        // - response.Status == ResponseStatus.Success: All deletions successful
        // - response.Status == ResponseStatus.PartialSuccess: Some deletions succeeded, some failed
        // - response.Status == ResponseStatus.Failure: All deletions failed
        // - response.Data contains the successfully deleted IDs
        // - response.Messages contains detailed error information

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
