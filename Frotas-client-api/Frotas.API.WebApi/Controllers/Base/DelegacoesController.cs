using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DelegacaoService;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.DelegacaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/delegacoes")]
  [ApiController]
  public class DelegacoesController(IDelegacaoService DelegacaoService) : ControllerBase
  {
    private readonly IDelegacaoService _DelegacaoService = DelegacaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetDelegacoesAsync(string keyword = "")
    {
      Response<IEnumerable<DelegacaoDTO>> result = await _DelegacaoService.GetDelegacoesAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetDelegacoesPaginatedAsync(DelegacaoTableFilter filter)
    {
      PaginatedResponse<DelegacaoDTO> result = await _DelegacaoService.GetDelegacoesPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDelegacaoAsync(Guid id)
    {
      Response<DelegacaoDTO> result = await _DelegacaoService.GetDelegacaoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateDelegacaoAsync(CreateDelegacaoRequest request)
    {
      try
      {
        Response<Guid> result = await _DelegacaoService.CreateDelegacaoAsync(request);
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
    public async Task<IActionResult> UpdateDelegacaoAsync(UpdateDelegacaoRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _DelegacaoService.UpdateDelegacaoAsync(request, id);
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
    public async Task<IActionResult> DeleteDelegacaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _DelegacaoService.DeleteDelegacaoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleDelegacoesAsync(
      [FromBody] DeleteMultipleDelegacaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _DelegacaoService.DeleteMultipleDelegacoesAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
