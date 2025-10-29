using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.FreguesiaService;
using GACloud.API.Application.Services.Base.FreguesiaService.DTOs;
using GACloud.API.Application.Services.Base.FreguesiaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class FreguesiasController(IFreguesiaService FreguesiaService) : ControllerBase
  {
    private readonly IFreguesiaService _FreguesiaService = FreguesiaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetFreguesiasAsync(string keyword = "")
    {
      Response<IEnumerable<FreguesiaDTO>> result = await _FreguesiaService.GetFreguesiasAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetFreguesiasPaginatedAsync(FreguesiaTableFilter filter)
    {
      PaginatedResponse<FreguesiaDTO> result = await _FreguesiaService.GetFreguesiasPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFreguesiaAsync(Guid id)
    {
      Response<FreguesiaDTO> result = await _FreguesiaService.GetFreguesiaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateFreguesiaAsync(CreateFreguesiaRequest request)
    {
      try
      {
        Response<Guid> result = await _FreguesiaService.CreateFreguesiaAsync(request);
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
    public async Task<IActionResult> UpdateFreguesiaAsync(UpdateFreguesiaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _FreguesiaService.UpdateFreguesiaAsync(request, id);
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
    public async Task<IActionResult> DeleteFreguesiaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _FreguesiaService.DeleteFreguesiaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleFreguesiasAsync(
      [FromBody] DeleteMultipleFreguesiaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _FreguesiaService.DeleteMultipleFreguesiasAsync(request.Ids);

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
