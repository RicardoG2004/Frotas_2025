using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/sepulturas/tipos/descricoes")]
  [ApiController]
  public class SepulturaTiposDescricaoController(
    ISepulturaTipoDescricaoService SepulturaTipoDescricaoService
  ) : ControllerBase
  {
    private readonly ISepulturaTipoDescricaoService _SepulturaTipoDescricaoService =
      SepulturaTipoDescricaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSepulturaTiposDescricaoAsync(string keyword = "")
    {
      Response<IEnumerable<SepulturaTipoDescricaoDTO>> result =
        await _SepulturaTipoDescricaoService.GetSepulturaTiposDescricaoAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSepulturaTiposDescricaoPaginatedAsync(
      SepulturaTipoDescricaoTableFilter filter
    )
    {
      PaginatedResponse<SepulturaTipoDescricaoDTO> result =
        await _SepulturaTipoDescricaoService.GetSepulturaTiposDescricaoPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSepulturaTipoDescricaoAsync(Guid id)
    {
      Response<SepulturaTipoDescricaoDTO> result =
        await _SepulturaTipoDescricaoService.GetSepulturaTipoDescricaoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSepulturaTipoDescricaoAsync(
      CreateSepulturaTipoDescricaoRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _SepulturaTipoDescricaoService.CreateSepulturaTipoDescricaoAsync(request);
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
    public async Task<IActionResult> UpdateSepulturaTipoDescricaoAsync(
      UpdateSepulturaTipoDescricaoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _SepulturaTipoDescricaoService.UpdateSepulturaTipoDescricaoAsync(request, id);
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
    public async Task<IActionResult> DeleteSepulturaTipoDescricaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _SepulturaTipoDescricaoService.DeleteSepulturaTipoDescricaoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCemiterioSepulturaTipoDescricoesAsync(
      [FromBody] DeleteMultipleSepulturaTipoDescricaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SepulturaTipoDescricaoService.DeleteMultipleSepulturaTipoDescricoesAsync(
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
