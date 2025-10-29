using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/defuntos/tipos")]
  [ApiController]
  public class DefuntoTiposController(
    IDefuntoTipoService DefuntoTipoService
  ) : ControllerBase
  {
    private readonly IDefuntoTipoService _DefuntoTipoService =
      DefuntoTipoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetDefuntoTiposAsync(string keyword = "")
    {
      Response<IEnumerable<DefuntoTipoDTO>> result =
        await _DefuntoTipoService.GetDefuntoTiposAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetDefuntoTiposPaginatedAsync(
      DefuntoTipoTableFilter filter
    )
    {
      PaginatedResponse<DefuntoTipoDTO> result =
        await _DefuntoTipoService.GetDefuntoTiposPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDefuntoTipoAsync(Guid id)
    {
      Response<DefuntoTipoDTO> result =
        await _DefuntoTipoService.GetDefuntoTipoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateDefuntoTipoAsync(
      CreateDefuntoTipoRequest request
    )
    {
      try
      {
        Response<Guid> result = await _DefuntoTipoService.CreateDefuntoTipoAsync(
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
    public async Task<IActionResult> UpdateDefuntoTipoAsync(
      UpdateDefuntoTipoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _DefuntoTipoService.UpdateDefuntoTipoAsync(
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
    public async Task<IActionResult> DeleteDefuntoTipoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _DefuntoTipoService.DeleteDefuntoTipoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleDefuntoTiposAsync(
      [FromBody] DeleteMultipleDefuntoTipoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _DefuntoTipoService.DeleteMultipleDefuntoTiposAsync(request.Ids);

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
