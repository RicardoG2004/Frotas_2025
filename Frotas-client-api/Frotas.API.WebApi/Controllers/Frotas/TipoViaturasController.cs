using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.TipoViaturaService;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/tipo-viaturas")]
  [ApiController]
  public class TipoViaturasController(ITipoViaturaService TipoViaturaService)
    : ControllerBase
  {
    private readonly ITipoViaturaService _TipoViaturaService = TipoViaturaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetTipoViaturasAsync(string keyword = "")
    {
      Response<IEnumerable<TipoViaturaDTO>> result =
        await _TipoViaturaService.GetTipoViaturasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetTipoViaturasPaginatedAsync(
      TipoViaturaTableFilter filter
    )
    {
      PaginatedResponse<TipoViaturaDTO> result =
        await _TipoViaturaService.GetTipoViaturasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTipoViaturaAsync(Guid id)
    {
      Response<TipoViaturaDTO> result =
        await _TipoViaturaService.GetTipoViaturaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateTipoViaturaAsync(
      CreateTipoViaturaRequest request
    )
    {
      try
      {
        Response<Guid> result = await _TipoViaturaService.CreateTipoViaturaAsync(request);
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
    public async Task<IActionResult> UpdateTipoViaturaAsync(
      UpdateTipoViaturaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _TipoViaturaService.UpdateTipoViaturaAsync(
          request,
          id
        );
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
    public async Task<IActionResult> DeleteTipoViaturaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _TipoViaturaService.DeleteTipoViaturaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleTipoViaturasAsync(
      [FromBody] DeleteMultipleTipoViaturaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _TipoViaturaService.DeleteMultipleTipoViaturasAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
