using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DistritoService;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;
using Frotas.API.Application.Services.Base.DistritoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class DistritosController(IDistritoService DistritoService) : ControllerBase
  {
    private readonly IDistritoService _DistritoService = DistritoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetDistritosAsync(string keyword = "")
    {
      Response<IEnumerable<DistritoDTO>> result = await _DistritoService.GetDistritosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetDistritosPaginatedAsync(DistritoTableFilter filter)
    {
      PaginatedResponse<DistritoDTO> result = await _DistritoService.GetDistritosPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDistritoAsync(Guid id)
    {
      Response<DistritoDTO> result = await _DistritoService.GetDistritoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateDistritoAsync(CreateDistritoRequest request)
    {
      Response<Guid> result = await _DistritoService.CreateDistritoAsync(request);
      return Ok(result);
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDistritoAsync(UpdateDistritoRequest request, Guid id)
    {
      Response<Guid> result = await _DistritoService.UpdateDistritoAsync(request, id);
      return Ok(result);
    }

    // delete
    [Authorize(Roles = "client")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDistritoAsync(Guid id)
    {
      Response<Guid> response = await _DistritoService.DeleteDistritoAsync(id);
      return Ok(response);
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleDistritosAsync(
      [FromBody] DeleteMultipleDistritoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _DistritoService.DeleteMultipleDistritosAsync(
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
