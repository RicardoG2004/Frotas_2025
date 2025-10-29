using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RuaService;
using GACloud.API.Application.Services.Base.RuaService.DTOs;
using GACloud.API.Application.Services.Base.RuaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class RuasController(IRuaService RuaService) : ControllerBase
  {
    private readonly IRuaService _RuaService = RuaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetRuasAsync(string keyword = "")
    {
      Response<IEnumerable<RuaDTO>> result = await _RuaService.GetRuasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetRuasPaginatedAsync(RuaTableFilter filter)
    {
      PaginatedResponse<RuaDTO> result = await _RuaService.GetRuasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRuaAsync(Guid id)
    {
      Response<RuaDTO> result = await _RuaService.GetRuaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateRuaAsync(CreateRuaRequest request)
    {
      try
      {
        Response<Guid> result = await _RuaService.CreateRuaAsync(request);
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
    public async Task<IActionResult> UpdateRuaAsync(UpdateRuaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _RuaService.UpdateRuaAsync(request, id);
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
    public async Task<IActionResult> DeleteRuaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _RuaService.DeleteRuaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleRuasAsync(
      [FromBody] DeleteMultipleRuaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _RuaService.DeleteMultipleRuasAsync(
          request.Ids
        );

        // Frontend can now differentiate between response types:
        // - response.Status == ResponseStatus.Success: All deletions successful
        // - response.Status == ResponseStatus.PartialSuccess: Some deletions succeeded, some failed
        // - response.Status == ResponseStatus.Failure: All deletions failed
        // - response.Data contains the successfully deleted IDs
        // - response.Messages contains detailed error information

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
