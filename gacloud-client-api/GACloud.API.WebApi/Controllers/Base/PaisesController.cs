using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.PaisService;
using GACloud.API.Application.Services.Base.PaisService.DTOs;
using GACloud.API.Application.Services.Base.PaisService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class PaisesController(IPaisService PaisService) : ControllerBase
  {
    private readonly IPaisService _PaisService = PaisService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetPaisesAsync(string keyword = "")
    {
      Response<IEnumerable<PaisDTO>> result = await _PaisService.GetPaisesAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetPaisesPaginatedAsync(PaisTableFilter filter)
    {
      PaginatedResponse<PaisDTO> result = await _PaisService.GetPaisesPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPaisAsync(Guid id)
    {
      Response<PaisDTO> result = await _PaisService.GetPaisAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreatePaisAsync(CreatePaisRequest request)
    {
      try
      {
        Response<Guid> result = await _PaisService.CreatePaisAsync(request);
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
    public async Task<IActionResult> UpdatePaisAsync(UpdatePaisRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _PaisService.UpdatePaisAsync(request, id);
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
    public async Task<IActionResult> DeletePaisAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _PaisService.DeletePaisAsync(id);
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
    public async Task<IActionResult> DeleteMultiplePaisesAsync(
      [FromBody] DeleteMultiplePaisRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _PaisService.DeleteMultiplePaisesAsync(
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
