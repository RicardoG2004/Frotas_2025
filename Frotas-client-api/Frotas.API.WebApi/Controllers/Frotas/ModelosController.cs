using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ModeloService;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/modelos")]
  [ApiController]
  public class ModelosController(IModeloService ModeloService)
    : ControllerBase
  {
    private readonly IModeloService _ModeloService = ModeloService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetModelosAsync(string keyword = "")
    {
      Response<IEnumerable<ModeloDTO>> result =
        await _ModeloService.GetModelosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetModelosPaginatedAsync(
      ModeloTableFilter filter
    )
    {
      PaginatedResponse<ModeloDTO> result =
        await _ModeloService.GetModelosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetModeloAsync(Guid id)
    {
      Response<ModeloDTO> result =
        await _ModeloService.GetModeloAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateModeloAsync(
      CreateModeloRequest request
    )
    {
      try
      {
        Response<Guid> result = await _ModeloService.CreateModeloAsync(request);
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
    public async Task<IActionResult> UpdateModeloAsync(
      UpdateModeloRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _ModeloService.UpdateModeloAsync(
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
    public async Task<IActionResult> DeleteModeloAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _ModeloService.DeleteModeloAsync(id);
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
    public async Task<IActionResult> DeleteMultipleModelosAsync(
      [FromBody] DeleteMultipleModeloRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ModeloService.DeleteMultipleModelosAsync(request.Ids);
          
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
