using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.LocalizacaoService;
using Frotas.API.Application.Services.Base.LocalizacaoService.DTOs;
using Frotas.API.Application.Services.Base.LocalizacaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/localizacoes")]
  [ApiController]
  public class LocalizacoesController(ILocalizacaoService LocalizacaoService) : ControllerBase
  {
    private readonly ILocalizacaoService _LocalizacaoService = LocalizacaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetLocalizacoesAsync(string keyword = "")
    {
      Response<IEnumerable<LocalizacaoDTO>> result = await _LocalizacaoService.GetLocalizacoesAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetLocalizacoesPaginatedAsync(LocalizacaoTableFilter filter)
    {
      PaginatedResponse<LocalizacaoDTO> result = await _LocalizacaoService.GetLocalizacoesPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLocalizacaoAsync(Guid id)
    {
      Response<LocalizacaoDTO> result = await _LocalizacaoService.GetLocalizacaoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateLocalizacaoAsync(CreateLocalizacaoRequest request)
    {
      try
      {
        Response<Guid> result = await _LocalizacaoService.CreateLocalizacaoAsync(request);
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
    public async Task<IActionResult> UpdateLocalizacaoAsync(UpdateLocalizacaoRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _LocalizacaoService.UpdateLocalizacaoAsync(request, id);
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
    public async Task<IActionResult> DeleteLocalizacaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _LocalizacaoService.DeleteLocalizacaoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleLocalizacoesAsync(
      [FromBody] DeleteMultipleLocalizacaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _LocalizacaoService.DeleteMultipleLocalizacoesAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
