using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Frotas.CoveiroService;
using GACloud.API.Application.Services.Frotas.CoveiroService.DTOs;
using GACloud.API.Application.Services.Frotas.CoveiroService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/coveiros")]
  [ApiController]
  public class CoveirosController(ICoveiroService CoveiroService)
    : ControllerBase
  {
    private readonly ICoveiroService _CoveiroService = CoveiroService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCoveirosAsync(string keyword = "")
    {
      Response<IEnumerable<CoveiroDTO>> result =
        await _CoveiroService.GetCoveirosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCoveirosPaginatedAsync(
      CoveiroTableFilter filter
    )
    {
      PaginatedResponse<CoveiroDTO> result =
        await _CoveiroService.GetCoveirosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCoveiroAsync(Guid id)
    {
      Response<CoveiroDTO> result =
        await _CoveiroService.GetCoveiroAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCoveiroAsync(
      CreateCoveiroRequest request
    )
    {
      try
      {
        Response<Guid> result = await _CoveiroService.CreateCoveiroAsync(request);
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
    public async Task<IActionResult> UpdateCoveiroAsync(
      UpdateCoveiroRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _CoveiroService.UpdateCoveiroAsync(
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
    public async Task<IActionResult> DeleteCoveiroAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CoveiroService.DeleteCoveiroAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCoveirosAsync(
      [FromBody] DeleteMultipleCoveiroRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CoveiroService.DeleteMultipleCoveirosAsync(request.Ids);

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
