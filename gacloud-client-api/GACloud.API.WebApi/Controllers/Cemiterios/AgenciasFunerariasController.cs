using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService;
using GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/agenciasfunerarias")]
  [ApiController]
  public class AgenciasFunerariasController(
    IAgenciaFunerariaService AgenciaFunerariaService
  ) : ControllerBase
  {
    private readonly IAgenciaFunerariaService _AgenciaFunerariaService =
      AgenciaFunerariaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetAgenciasFunerariasAsync(string keyword = "")
    {
      Response<IEnumerable<AgenciaFunerariaDTO>> result =
        await _AgenciaFunerariaService.GetAgenciasFunerariasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetAgenciasFunerariasPaginatedAsync(
      AgenciaFunerariaTableFilter filter
    )
    {
      PaginatedResponse<AgenciaFunerariaDTO> result =
        await _AgenciaFunerariaService.GetAgenciasFunerariasPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAgenciaFunerariaAsync(Guid id)
    {
      Response<AgenciaFunerariaDTO> result =
        await _AgenciaFunerariaService.GetAgenciaFunerariaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateAgenciaFunerariaAsync(
      CreateAgenciaFunerariaRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _AgenciaFunerariaService.CreateAgenciaFunerariaAsync(request);
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
    public async Task<IActionResult> UpdateAgenciaFunerariaAsync(
      UpdateAgenciaFunerariaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _AgenciaFunerariaService.UpdateAgenciaFunerariaAsync(request, id);
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
    public async Task<IActionResult> DeleteAgenciaFunerariaAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _AgenciaFunerariaService.DeleteAgenciaFunerariaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleAgenciasFunerariasAsync(
      [FromBody] DeleteMultipleAgenciaFunerariaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _AgenciaFunerariaService.DeleteMultipleAgenciasFunerariasAsync(
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
