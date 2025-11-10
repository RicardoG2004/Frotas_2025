using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguroService;
using Frotas.API.Application.Services.Frotas.SeguroService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguroService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/seguros")]
  [ApiController]
  public class SegurosController(ISeguroService SeguroService)
    : ControllerBase
  {
    private readonly ISeguroService _SeguroService = SeguroService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSegurosAsync(string keyword = "")
    {
      Response<IEnumerable<SeguroDTO>> result =
        await _SeguroService.GetSegurosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSegurosPaginatedAsync(
      SeguroTableFilter filter
    )
    {
      PaginatedResponse<SeguroDTO> result =
        await _SeguroService.GetSegurosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSeguroAsync(Guid id)
    {
      Response<SeguroDTO> result =
        await _SeguroService.GetSeguroAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSeguroAsync(
      CreateSeguroRequest request
    )
    {
      try
      {
        Response<Guid> result = await _SeguroService.CreateSeguroAsync(request);
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
    public async Task<IActionResult> UpdateSeguroAsync(
      UpdateSeguroRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _SeguroService.UpdateSeguroAsync(
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
    public async Task<IActionResult> DeleteSeguroAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _SeguroService.DeleteSeguroAsync(id);
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
    public async Task<IActionResult> DeleteMultipleSegurosAsync(
      [FromBody] DeleteMultipleSeguroRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SeguroService.DeleteMultipleSegurosAsync(request.Ids);
          
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
