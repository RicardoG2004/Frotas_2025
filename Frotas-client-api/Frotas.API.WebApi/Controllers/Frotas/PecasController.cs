using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.PecaService;
using Frotas.API.Application.Services.Frotas.PecaService.DTOs;
using Frotas.API.Application.Services.Frotas.PecaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/pecas")]
  [ApiController]
  public class PecasController(
    IPecaService PecaService
  ) : ControllerBase
  {
    private readonly IPecaService _PecaService = PecaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetPecasAsync(string keyword = "")
    {
      Response<IEnumerable<PecaDTO>> result =
        await _PecaService.GetPecasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetPecasPaginatedAsync(
      PecaTableFilter filter
    )
    {
      PaginatedResponse<PecaDTO> result =
        await _PecaService.GetPecasPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPecaAsync(Guid id)
    {
      Response<PecaDTO> result =
        await _PecaService.GetPecaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreatePecaAsync(
      CreatePecaRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _PecaService.CreatePecaAsync(request);
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
    public async Task<IActionResult> UpdatePecaAsync(
      UpdatePecaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _PecaService.UpdatePecaAsync(request, id);
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
    public async Task<IActionResult> DeletePecaAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _PecaService.DeletePecaAsync(id);
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
    public async Task<IActionResult> DeleteMultiplePecasAsync(
      [FromBody] DeleteMultiplePecaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _PecaService.DeleteMultiplePecasAsync(
            request.Ids
          );

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
