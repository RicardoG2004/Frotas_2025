using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CombustivelService;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/combustiveis")]
  [ApiController]
  public class CombustiveisController(ICombustivelService CombustivelService)
    : ControllerBase
  {
    private readonly ICombustivelService _CombustivelService = CombustivelService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCombustiveisAsync(string keyword = "")
    {
      Response<IEnumerable<CombustivelDTO>> result =
        await _CombustivelService.GetCombustiveisAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCombustiveisPaginatedAsync(
      CombustivelTableFilter filter
    )
    {
      PaginatedResponse<CombustivelDTO> result =
        await _CombustivelService.GetCombustiveisPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCombustivelAsync(Guid id)
    {
      Response<CombustivelDTO> result =
        await _CombustivelService.GetCombustivelAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCombustivelAsync(
      CreateCombustivelRequest request
    )
    {
      try
      {
        Response<Guid> result = await _CombustivelService.CreateCombustivelAsync(request);
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
    public async Task<IActionResult> UpdateCombustivelAsync(
      UpdateCombustivelRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _CombustivelService.UpdateCombustivelAsync(
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
    public async Task<IActionResult> DeleteCombustivelAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CombustivelService.DeleteCombustivelAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCombustiveisAsync(
      [FromBody] DeleteMultipleCombustivelRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CombustivelService.DeleteMultipleCombustiveisAsync(request.Ids);
          
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
