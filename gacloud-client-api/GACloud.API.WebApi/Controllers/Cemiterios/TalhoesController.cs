using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.TalhaoService;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/talhoes")]
  [ApiController]
  public class TalhoesController(ITalhaoService TalhaoService)
    : ControllerBase
  {
    private readonly ITalhaoService _TalhaoService = TalhaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetTalhoesAsync(
      string keyword = "",
      string? cemiterioId = null
    )
    {
      Response<IEnumerable<TalhaoDTO>> result =
        await _TalhaoService.GetTalhoesAsync(keyword, cemiterioId);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetTalhoesPaginatedAsync(
      TalhaoTableFilter filter
    )
    {
      PaginatedResponse<TalhaoDTO> result =
        await _TalhaoService.GetTalhoesPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTalhaoAsync(Guid id)
    {
      Response<TalhaoDTO> result = await _TalhaoService.GetTalhaoAsync(
        id
      );
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateTalhaoAsync(
      CreateTalhaoRequest request
    )
    {
      try
      {
        Response<Guid> result = await _TalhaoService.CreateTalhaoAsync(request);
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
    public async Task<IActionResult> UpdateTalhaoAsync(
      UpdateTalhaoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _TalhaoService.UpdateTalhaoAsync(
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
    public async Task<IActionResult> DeleteTalhaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _TalhaoService.DeleteTalhaoAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpPatch("{id}/svg")]
    public async Task<IActionResult> UpdateSvg(Guid id, UpdateTalhaoSvgRequest request)
    {
      return Ok(await _TalhaoService.UpdateTalhaoSvgAsync(request, id));
    }

    // delete multiple
    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleTalhoesAsync(
      [FromBody] DeleteMultipleTalhaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _TalhaoService.DeleteMultipleTalhoesAsync(request.Ids);

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
