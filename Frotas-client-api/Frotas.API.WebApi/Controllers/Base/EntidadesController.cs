using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.EntidadeService;
using Frotas.API.Application.Services.Base.EntidadeService.DTOs;
using Frotas.API.Application.Services.Base.EntidadeService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/entidades")]
  [ApiController]
  public class EntidadesController(IEntidadeService EntidadeService) : ControllerBase
  {
    private readonly IEntidadeService _EntidadeService = EntidadeService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetEntidadesAsync(string keyword = "")
    {
      Response<IEnumerable<EntidadeDTO>> result =
        await _EntidadeService.GetEntidadesAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetEntidadesPaginatedAsync(
      EntidadeTableFilter filter
    )
    {
      PaginatedResponse<EntidadeDTO> result =
        await _EntidadeService.GetEntidadesPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEntidadeAsync(Guid id)
    {
      Response<EntidadeDTO> result =
        await _EntidadeService.GetEntidadeAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateEntidadeAsync(
      CreateEntidadeRequest request
    )
    {
      try
      {
        Response<Guid> result = await _EntidadeService.CreateEntidadeAsync(request);
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
    public async Task<IActionResult> UpdateEntidadeAsync(
      UpdateEntidadeRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _EntidadeService.UpdateEntidadeAsync(
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
    public async Task<IActionResult> DeleteEntidadeAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _EntidadeService.DeleteEntidadeAsync(id);
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
    public async Task<IActionResult> DeleteMultipleEntidadesAsync(
      [FromBody] DeleteMultipleEntidadeRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _EntidadeService.DeleteMultipleEntidadesAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}


