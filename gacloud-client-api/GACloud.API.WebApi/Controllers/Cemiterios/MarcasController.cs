using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.MarcaService;
using GACloud.API.Application.Services.Cemiterios.MarcaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.MarcaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/marcas")]
  [ApiController]
  public class MarcasController(IMarcaService MarcaService)
    : ControllerBase
  {
    private readonly IMarcaService _MarcaService = MarcaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetMarcasAsync(string keyword = "")
    {
      Response<IEnumerable<MarcaDTO>> result =
        await _MarcaService.GetMarcasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetMarcasPaginatedAsync(
      MarcaTableFilter filter
    )
    {
      PaginatedResponse<MarcaDTO> result =
        await _MarcaService.GetMarcasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMarcaAsync(Guid id)
    {
      Response<MarcaDTO> result =
        await _MarcaService.GetMarcaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateMarcaAsync(
      CreateMarcaRequest request
    )
    {
      try
      {
        Response<Guid> result = await _MarcaService.CreateMarcaAsync(request);
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
    public async Task<IActionResult> UpdateMarcaAsync(
      UpdateMarcaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _MarcaService.UpdateMarcaAsync(
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
    public async Task<IActionResult> DeleteMarcaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _MarcaService.DeleteMarcaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleMarcasAsync(
      [FromBody] DeleteMultipleMarcaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _MarcaService.DeleteMultipleMarcasAsync(request.Ids);

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
