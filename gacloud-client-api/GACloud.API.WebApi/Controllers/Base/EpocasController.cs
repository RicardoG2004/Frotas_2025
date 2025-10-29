using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EpocaService;
using GACloud.API.Application.Services.Base.EpocaService.DTOs;
using GACloud.API.Application.Services.Base.EpocaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class EpocasController(IEpocaService EpocaService) : ControllerBase
  {
    private readonly IEpocaService _EpocaService = EpocaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetEpocasAsync(string keyword = "")
    {
      Response<IEnumerable<EpocaDTO>> result = await _EpocaService.GetEpocasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetEpocasPaginatedAsync(EpocaTableFilter filter)
    {
      PaginatedResponse<EpocaDTO> result = await _EpocaService.GetEpocasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEpocaAsync(Guid id)
    {
      Response<EpocaDTO> result = await _EpocaService.GetEpocaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateEpocaAsync(CreateEpocaRequest request)
    {
      try
      {
        Response<Guid> result = await _EpocaService.CreateEpocaAsync(request);
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
    public async Task<IActionResult> UpdateEpocaAsync(UpdateEpocaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _EpocaService.UpdateEpocaAsync(request, id);
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
    public async Task<IActionResult> DeleteEpocaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _EpocaService.DeleteEpocaAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // get predefined epoca
    [Authorize(Roles = "client")]
    [HttpGet("predefinida")]
    public async Task<IActionResult> GetEpocaPredefinidaAsync()
    {
      Response<EpocaDTO> result = await _EpocaService.GetEpocaPredefinidaAsync();
      return Ok(result);
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleEpocasAsync(
      [FromBody] DeleteMultipleEpocaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response = await _EpocaService.DeleteMultipleEpocasAsync(
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
