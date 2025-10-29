using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/sepulturas/tipos")]
  [ApiController]
  public class SepulturaTiposController(
    ISepulturaTipoService SepulturaTipoService
  ) : ControllerBase
  {
    private readonly ISepulturaTipoService _SepulturaTipoService =
      SepulturaTipoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSepulturaTiposAsync(string keyword = "")
    {
      Response<IEnumerable<SepulturaTipoDTO>> result =
        await _SepulturaTipoService.GetSepulturaTiposAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSepulturaTiposPaginatedAsync(
      SepulturaTipoTableFilter filter
    )
    {
      PaginatedResponse<SepulturaTipoDTO> result =
        await _SepulturaTipoService.GetSepulturaTiposPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSepulturaTipoAsync(Guid id)
    {
      Response<SepulturaTipoDTO> result =
        await _SepulturaTipoService.GetSepulturaTipoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSepulturaTipoAsync(
      CreateSepulturaTipoRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _SepulturaTipoService.CreateSepulturaTipoAsync(request);
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
    public async Task<IActionResult> UpdateSepulturaTipoAsync(
      UpdateSepulturaTipoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _SepulturaTipoService.UpdateSepulturaTipoAsync(request, id);
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
    public async Task<IActionResult> DeleteSepulturaTipoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _SepulturaTipoService.DeleteSepulturaTipoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleSepulturaTiposAsync(
      [FromBody] DeleteMultipleSepulturaTipoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SepulturaTipoService.DeleteMultipleSepulturaTiposAsync(
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
