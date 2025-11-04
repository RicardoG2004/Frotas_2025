using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ServicoService;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/servicos")]
  [ApiController]
  public class ServicosController(
    IServicoService ServicoService
  ) : ControllerBase
  {
    private readonly IServicoService _ServicoService = ServicoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetServicosAsync(string keyword = "")
    {
      Response<IEnumerable<ServicoDTO>> result =
        await _ServicoService.GetServicosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetServicosPaginatedAsync(
      ServicoTableFilter filter
    )
    {
      PaginatedResponse<ServicoDTO> result =
        await _ServicoService.GetServicosPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetServicoAsync(Guid id)
    {
      Response<ServicoDTO> result =
        await _ServicoService.GetServicoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreateServicoAsync(
      CreateServicoRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _ServicoService.CreateServicoAsync(request);
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
    public async Task<IActionResult> UpdateServicoAsync(
      UpdateServicoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _ServicoService.UpdateServicoAsync(request, id);
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
    public async Task<IActionResult> DeleteServicoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _ServicoService.DeleteServicoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleServicosAsync(
      [FromBody] DeleteMultipleServicoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ServicoService.DeleteMultipleServicosAsync(
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

