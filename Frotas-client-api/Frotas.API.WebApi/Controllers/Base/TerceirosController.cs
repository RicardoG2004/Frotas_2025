using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TerceiroService;
using Frotas.API.Application.Services.Base.TerceiroService.DTOs;
using Frotas.API.Application.Services.Base.TerceiroService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/terceiros")]
  [ApiController]
  public class TerceirosController(ITerceiroService TerceiroService) : ControllerBase
  {
    private readonly ITerceiroService _TerceiroService = TerceiroService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetTerceirosAsync(string keyword = "")
    {
      Response<IEnumerable<TerceiroDTO>> result = await _TerceiroService.GetTerceirosAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetTerceirosPaginatedAsync(TerceiroTableFilter filter)
    {
      PaginatedResponse<TerceiroDTO> result = await _TerceiroService.GetTerceirosPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTerceiroAsync(Guid id)
    {
      Response<TerceiroDTO> result = await _TerceiroService.GetTerceiroAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateTerceiroAsync(CreateTerceiroRequest request)
    {
      try
      {
        Response<Guid> result = await _TerceiroService.CreateTerceiroAsync(request);
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
    public async Task<IActionResult> UpdateTerceiroAsync(UpdateTerceiroRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _TerceiroService.UpdateTerceiroAsync(request, id);
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
    public async Task<IActionResult> DeleteTerceiroAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _TerceiroService.DeleteTerceiroAsync(id);
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
    public async Task<IActionResult> DeleteMultipleTerceirosAsync(
      [FromBody] DeleteMultipleTerceiroRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _TerceiroService.DeleteMultipleTerceirosAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
