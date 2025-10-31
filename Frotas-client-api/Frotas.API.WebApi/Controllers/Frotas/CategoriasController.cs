using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CategoriaService;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/categorias")]
  [ApiController]
  public class CategoriasController(ICategoriaService CategoriaService)
    : ControllerBase
  {
    private readonly ICategoriaService _CategoriaService = CategoriaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCategoriasAsync(string keyword = "")
    {
      Response<IEnumerable<CategoriaDTO>> result =
        await _CategoriaService.GetCategoriasAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCategoriasPaginatedAsync(
      CategoriaTableFilter filter
    )
    {
      PaginatedResponse<CategoriaDTO> result =
        await _CategoriaService.GetCategoriasPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoriaAsync(Guid id)
    {
      Response<CategoriaDTO> result =
        await _CategoriaService.GetCategoriaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCategoriaAsync(
      CreateCategoriaRequest request
    )
    {
      try
      {
        Response<Guid> result = await _CategoriaService.CreateCategoriaAsync(request);
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
    public async Task<IActionResult> UpdateCategoriaAsync(
      UpdateCategoriaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _CategoriaService.UpdateCategoriaAsync(
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
    public async Task<IActionResult> DeleteCategoriaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CategoriaService.DeleteCategoriaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCategoriasAsync(
      [FromBody] DeleteMultipleCategoriaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CategoriaService.DeleteMultipleCategoriasAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
