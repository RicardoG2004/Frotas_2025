using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaService;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/sepulturas")]
  [ApiController]
  public class SepulturasController(ISepulturaService SepulturaService)
    : ControllerBase
  {
    private readonly ISepulturaService _SepulturaService =
      SepulturaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSepulturasAsync(string keyword = "")
    {
      Response<IEnumerable<SepulturaDTO>> result =
        await _SepulturaService.GetSepulturasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSepulturasPaginatedAsync(
      SepulturaTableFilter filter
    )
    {
      PaginatedResponse<SepulturaDTO> result =
        await _SepulturaService.GetSepulturasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSepulturaAsync(Guid id)
    {
      Response<SepulturaDTO> result =
        await _SepulturaService.GetSepulturaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSepulturaAsync(
      CreateSepulturaRequest request
    )
    {
      try
      {
        Response<Guid> result = await _SepulturaService.CreateSepulturaAsync(
          request
        );
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
    public async Task<IActionResult> UpdateSepulturaAsync(
      UpdateSepulturaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _SepulturaService.UpdateSepulturaAsync(
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
    public async Task<IActionResult> DeleteSepulturaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _SepulturaService.DeleteSepulturaAsync(
          id
        );
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpPatch("{id}/svg")]
    public async Task<IActionResult> UpdateSvg(Guid id, UpdateSepulturaSvgRequest request)
    {
      return Ok(await _SepulturaService.UpdateSepulturaSvgAsync(request, id));
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleSepulturasAsync(
      [FromBody] DeleteMultipleSepulturaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SepulturaService.DeleteMultipleSepulturasAsync(request.Ids);

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
