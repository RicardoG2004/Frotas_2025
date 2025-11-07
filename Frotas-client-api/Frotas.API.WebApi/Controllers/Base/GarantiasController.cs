using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.GarantiaService;
using Frotas.API.Application.Services.Base.GarantiaService.DTOs;
using Frotas.API.Application.Services.Base.GarantiaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/garantias")]
  [ApiController]
  public class GarantiasController(IGarantiaService GarantiaService) : ControllerBase
  {
    private readonly IGarantiaService _GarantiaService = GarantiaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetGarantiasAsync(string keyword = "")
    {
      Response<IEnumerable<GarantiaDTO>> result = await _GarantiaService.GetGarantiasAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetGarantiasPaginatedAsync(GarantiaTableFilter filter)
    {
      PaginatedResponse<GarantiaDTO> result = await _GarantiaService.GetGarantiasPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGarantiaAsync(Guid id)
    {
      Response<GarantiaDTO> result = await _GarantiaService.GetGarantiaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateGarantiaAsync(CreateGarantiaRequest request)
    {
      try
      {
        Response<Guid> result = await _GarantiaService.CreateGarantiaAsync(request);
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
    public async Task<IActionResult> UpdateGarantiaAsync(UpdateGarantiaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _GarantiaService.UpdateGarantiaAsync(request, id);
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
    public async Task<IActionResult> DeleteGarantiaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _GarantiaService.DeleteGarantiaAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleGarantiasAsync(
      [FromBody] DeleteMultipleGarantiaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _GarantiaService.DeleteMultipleGarantiasAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
