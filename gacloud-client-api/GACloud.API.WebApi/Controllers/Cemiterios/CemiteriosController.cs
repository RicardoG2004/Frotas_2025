using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.CemiterioService;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/[controller]")]
  [ApiController]
  public class CemiteriosController(ICemiterioService CemiterioService) : ControllerBase
  {
    private readonly ICemiterioService _CemiterioService = CemiterioService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCemiteriosAsync(string keyword = "")
    {
      Response<IEnumerable<CemiterioDTO>> result = await _CemiterioService.GetCemiteriosAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCemiteriosPaginatedAsync(CemiterioTableFilter filter)
    {
      PaginatedResponse<CemiterioDTO> result = await _CemiterioService.GetCemiteriosPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCemiterioAsync(Guid id)
    {
      Response<CemiterioDTO> result = await _CemiterioService.GetCemiterioAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCemiterioAsync(CreateCemiterioRequest request)
    {
      try
      {
        Response<Guid> result = await _CemiterioService.CreateCemiterioAsync(request);
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
    public async Task<IActionResult> UpdateCemiterioAsync(UpdateCemiterioRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _CemiterioService.UpdateCemiterioAsync(request, id);
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
    public async Task<IActionResult> DeleteCemiterioAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CemiterioService.DeleteCemiterioAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // upload svg
    [Authorize(Roles = "client")]
    [HttpPost("upload-svg")]
    public async Task<IActionResult> UploadCemiterioSvgAsync(
      [FromForm] UploadCemiterioSvgRequest request
    )
    {
      try
      {
        Response<string> result = await _CemiterioService.UploadCemiterioSvgAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // get predefined cemiterio
    [Authorize(Roles = "client")]
    [HttpGet("predefinido")]
    public async Task<IActionResult> GetCemiterioPredefinidoAsync()
    {
      Response<CemiterioDTO> result = await _CemiterioService.GetCemiterioPredefinidoAsync();
      return Ok(result);
    }

    // get uploaded svg
    [Authorize(Roles = "client")]
    [HttpGet("{id}/svg")]
    public async Task<IActionResult> GetCemiterioSvgAsync(Guid id)
    {
      try
      {
        Response<string> result = await _CemiterioService.GetCemiterioSvgAsync(id);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleCemiteriosAsync(
      [FromBody] DeleteMultipleCemiterioRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CemiterioService.DeleteMultipleCemiteriosAsync(request.Ids);

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
