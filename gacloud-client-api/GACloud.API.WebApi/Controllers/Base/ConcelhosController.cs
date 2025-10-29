using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.ConcelhoService;
using GACloud.API.Application.Services.Base.ConcelhoService.DTOs;
using GACloud.API.Application.Services.Base.ConcelhoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class ConcelhosController(IConcelhoService ConcelhoService) : ControllerBase
  {
    private readonly IConcelhoService _ConcelhoService = ConcelhoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetConcelhosAsync(string keyword = "")
    {
      Response<IEnumerable<ConcelhoDTO>> result = await _ConcelhoService.GetConcelhosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetConcelhosPaginatedAsync(ConcelhoTableFilter filter)
    {
      PaginatedResponse<ConcelhoDTO> result = await _ConcelhoService.GetConcelhosPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetConcelhoAsync(Guid id)
    {
      Response<ConcelhoDTO> result = await _ConcelhoService.GetConcelhoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateConcelhoAsync(CreateConcelhoRequest request)
    {
      Response<Guid> result = await _ConcelhoService.CreateConcelhoAsync(request);
      return Ok(result);
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateConcelhoAsync(UpdateConcelhoRequest request, Guid id)
    {
      Response<Guid> result = await _ConcelhoService.UpdateConcelhoAsync(request, id);
      return Ok(result);
    }

    // delete
    [Authorize(Roles = "client")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConcelhoAsync(Guid id)
    {
      Response<Guid> response = await _ConcelhoService.DeleteConcelhoAsync(id);
      return Ok(response);
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleConcelhosAsync(
      [FromBody] DeleteMultipleConcelhoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _ConcelhoService.DeleteMultipleConcelhosAsync(
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
