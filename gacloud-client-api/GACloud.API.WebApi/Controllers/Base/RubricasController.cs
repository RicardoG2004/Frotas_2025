using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RubricaService;
using GACloud.API.Application.Services.Base.RubricaService.DTOs;
using GACloud.API.Application.Services.Base.RubricaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/rubricas")]
  [ApiController]
  public class RubricasController(IRubricaService RubricaService) : ControllerBase
  {
    private readonly IRubricaService _RubricaService = RubricaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetRubricasAsync(string keyword = "", string? epocaId = null)
    {
      Response<IEnumerable<RubricaDTO>> result = await _RubricaService.GetRubricasAsync(
        keyword,
        epocaId
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetRubricasPaginatedAsync(RubricaTableFilter filter)
    {
      PaginatedResponse<RubricaDTO> result = await _RubricaService.GetRubricasPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRubricaAsync(Guid id)
    {
      Response<RubricaDTO> result = await _RubricaService.GetRubricaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateRubricaAsync(CreateRubricaRequest request)
    {
      try
      {
        Response<Guid> result = await _RubricaService.CreateRubricaAsync(request);
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
    public async Task<IActionResult> UpdateRubricaAsync(UpdateRubricaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _RubricaService.UpdateRubricaAsync(request, id);
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
    public async Task<IActionResult> DeleteRubricaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _RubricaService.DeleteRubricaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleRubricasAsync(
      [FromBody] DeleteMultipleRubricaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _RubricaService.DeleteMultipleRubricasAsync(
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
