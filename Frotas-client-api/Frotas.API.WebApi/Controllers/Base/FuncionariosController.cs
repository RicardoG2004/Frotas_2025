using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FuncionarioService;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Base.FuncionarioService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/funcionarios")]
  [ApiController]
  public class FuncionariosController(IFuncionarioService FuncionarioService) : ControllerBase
  {
    private readonly IFuncionarioService _FuncionarioService = FuncionarioService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetFuncionariosAsync(string keyword = "")
    {
      Response<IEnumerable<FuncionarioDTO>> result =
        await _FuncionarioService.GetFuncionariosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetFuncionariosPaginatedAsync(
      FuncionarioTableFilter filter
    )
    {
      PaginatedResponse<FuncionarioDTO> result =
        await _FuncionarioService.GetFuncionariosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFuncionarioAsync(Guid id)
    {
      Response<FuncionarioDTO> result =
        await _FuncionarioService.GetFuncionarioAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateFuncionarioAsync(
      CreateFuncionarioRequest request
    )
    {
      try
      {
        Response<Guid> result = await _FuncionarioService.CreateFuncionarioAsync(request);
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
    public async Task<IActionResult> UpdateFuncionarioAsync(
      UpdateFuncionarioRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _FuncionarioService.UpdateFuncionarioAsync(
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
    public async Task<IActionResult> DeleteFuncionarioAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _FuncionarioService.DeleteFuncionarioAsync(id);
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
    public async Task<IActionResult> DeleteMultipleFuncionariosAsync(
      [FromBody] DeleteMultipleFuncionarioRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _FuncionarioService.DeleteMultipleFuncionariosAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}


