using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CodigoPostalService;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.CodigoPostalService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class CodigosPostaisController(ICodigoPostalService CodigoPostalService) : ControllerBase
  {
    private readonly ICodigoPostalService _CodigoPostalService = CodigoPostalService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCodigosPostaisAsync(string keyword = "")
    {
      Response<IEnumerable<CodigoPostalDTO>> result =
        await _CodigoPostalService.GetCodigosPostaisAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCodigosPostaisPaginatedAsync(CodigoPostalTableFilter filter)
    {
      PaginatedResponse<CodigoPostalDTO> result =
        await _CodigoPostalService.GetCodigosPostaisPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCodigoPostalAsync(Guid id)
    {
      Response<CodigoPostalDTO> result = await _CodigoPostalService.GetCodigoPostalAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCodigoPostalAsync(CreateCodigoPostalRequest request)
    {
      try
      {
        Response<Guid> result = await _CodigoPostalService.CreateCodigoPostalAsync(request);
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
    public async Task<IActionResult> UpdateCodigoPostalAsync(
      UpdateCodigoPostalRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _CodigoPostalService.UpdateCodigoPostalAsync(request, id);
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
    public async Task<IActionResult> DeleteCodigoPostalAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CodigoPostalService.DeleteCodigoPostalAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCodigosPostaisAsync(
      [FromBody] DeleteMultipleCodigoPostalRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CodigoPostalService.DeleteMultipleCodigosPostaisAsync(request.Ids);

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
