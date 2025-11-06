using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CorService;
using Frotas.API.Application.Services.Base.CorService.DTOs;
using Frotas.API.Application.Services.Base.CorService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class CoresController(ICorService CorService) : ControllerBase
  {
    private readonly ICorService _CorService = CorService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCoresAsync(string keyword = "")
    {
      Response<IEnumerable<CorDTO>> result = await _CorService.GetCoresAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCorsPaginatedAsync(CorTableFilter filter)
    {
      PaginatedResponse<CorDTO> result = await _CorService.GetCorsPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCorAsync(Guid id)
    {
      Response<CorDTO> result = await _CorService.GetCorAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCorAsync(CreateCorRequest request)
    {
      Response<Guid> result = await _CorService.CreateCorAsync(request);
      return Ok(result);
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCorAsync(UpdateCorRequest request, Guid id)
    {
      Response<Guid> result = await _CorService.UpdateCorAsync(request, id);
      return Ok(result);
    }

    // delete
    [Authorize(Roles = "client")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCorAsync(Guid id)
    {
      Response<Guid> response = await _CorService.DeleteCorAsync(id);
      return Ok(response);
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleCorsAsync(
      [FromBody] DeleteMultipleCorRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _CorService.DeleteMultipleCorsAsync(
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
