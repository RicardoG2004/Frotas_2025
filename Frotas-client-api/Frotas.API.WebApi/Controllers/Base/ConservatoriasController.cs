using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.ConservatoriaService;
using Frotas.API.Application.Services.Base.ConservatoriaService.DTOs;
using Frotas.API.Application.Services.Base.ConservatoriaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/conservatorias")]
  [ApiController]
  public class ConservatoriasController(IConservatoriaService ConservatoriaService) : ControllerBase
  {
    private readonly IConservatoriaService _ConservatoriaService = ConservatoriaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetConservatoriasAsync(string keyword = "")
    {
      Response<IEnumerable<ConservatoriaDTO>> result = await _ConservatoriaService.GetConservatoriasAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetConservatoriasPaginatedAsync(ConservatoriaTableFilter filter)
    {
      PaginatedResponse<ConservatoriaDTO> result = await _ConservatoriaService.GetConservatoriasPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetConservatoriaAsync(Guid id)
    {
      Response<ConservatoriaDTO> result = await _ConservatoriaService.GetConservatoriaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateConservatoriaAsync(CreateConservatoriaRequest request)
    {
      try
      {
        Response<Guid> result = await _ConservatoriaService.CreateConservatoriaAsync(request);
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
    public async Task<IActionResult> UpdateConservatoriaAsync(UpdateConservatoriaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _ConservatoriaService.UpdateConservatoriaAsync(request, id);
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
    public async Task<IActionResult> DeleteConservatoriaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _ConservatoriaService.DeleteConservatoriaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleConservatoriasAsync(
      [FromBody] DeleteMultipleConservatoriaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ConservatoriaService.DeleteMultipleConservatoriasAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
