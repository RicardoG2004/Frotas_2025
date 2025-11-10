using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguradoraService;
using Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguradoraService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/seguradoras")]
  [ApiController]
  public class SeguradorasController(ISeguradoraService SeguradoraService)
    : ControllerBase
  {
    private readonly ISeguradoraService _SeguradoraService = SeguradoraService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSeguradorasAsync(string keyword = "")
    {
      Response<IEnumerable<SeguradoraDTO>> result =
        await _SeguradoraService.GetSeguradorasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSeguradorasPaginatedAsync(
      SeguradoraTableFilter filter
    )
    {
      PaginatedResponse<SeguradoraDTO> result =
        await _SeguradoraService.GetSeguradorasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSeguradoraAsync(Guid id)
    {
      Response<SeguradoraDTO> result =
        await _SeguradoraService.GetSeguradoraAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSeguradoraAsync(
      CreateSeguradoraRequest request
    )
    {
      try
      {
        Response<Guid> result = await _SeguradoraService.CreateSeguradoraAsync(request);
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
    public async Task<IActionResult> UpdateSeguradoraAsync(
      UpdateSeguradoraRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _SeguradoraService.UpdateSeguradoraAsync(
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
    public async Task<IActionResult> DeleteSeguradoraAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _SeguradoraService.DeleteSeguradoraAsync(id);
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
    public async Task<IActionResult> DeleteMultipleSeguradorasAsync(
      [FromBody] DeleteMultipleSeguradoraRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SeguradoraService.DeleteMultipleSeguradorasAsync(request.Ids);
          
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
