using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ManutencaoService;
using Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs;
using Frotas.API.Application.Services.Frotas.ManutencaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/manutencoes")]
  [ApiController]
  public class ManutencoesController(
    IManutencaoService ManutencaoService
  ) : ControllerBase
  {
    private readonly IManutencaoService _ManutencaoService = ManutencaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetManutencoesAsync(string keyword = "")
    {
      Response<IEnumerable<ManutencaoDTO>> result =
        await _ManutencaoService.GetManutencoesAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetManutencoesPaginatedAsync(
      ManutencaoTableFilter filter
    )
    {
      PaginatedResponse<ManutencaoDTO> result =
        await _ManutencaoService.GetManutencoesPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetManutencaoAsync(Guid id)
    {
      Response<ManutencaoDTO> result =
        await _ManutencaoService.GetManutencaoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreateManutencaoAsync(
      CreateManutencaoRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _ManutencaoService.CreateManutencaoAsync(request);
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
    public async Task<IActionResult> UpdateManutencaoAsync(
      UpdateManutencaoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _ManutencaoService.UpdateManutencaoAsync(request, id);
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
    public async Task<IActionResult> DeleteManutencaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _ManutencaoService.DeleteManutencaoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleManutencoesAsync(
      [FromBody] DeleteMultipleManutencaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ManutencaoService.DeleteMultipleManutencoesAsync(
            request.Ids
          );

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}

