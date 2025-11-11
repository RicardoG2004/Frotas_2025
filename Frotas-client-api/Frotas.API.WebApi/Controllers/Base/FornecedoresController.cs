using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FornecedorService;
using Frotas.API.Application.Services.Base.FornecedorService.DTOs;
using Frotas.API.Application.Services.Base.FornecedorService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/fornecedores")]
  [ApiController]
  public class FornecedoresController(IFornecedorService FornecedorService) : ControllerBase
  {
    private readonly IFornecedorService _FornecedorService = FornecedorService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetFornecedoresAsync(string keyword = "")
    {
      Response<IEnumerable<FornecedorDTO>> result =
        await _FornecedorService.GetFornecedoresAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetFornecedoresPaginatedAsync(
      FornecedorTableFilter filter
    )
    {
      PaginatedResponse<FornecedorDTO> result =
        await _FornecedorService.GetFornecedoresPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFornecedorAsync(Guid id)
    {
      Response<FornecedorDTO> result =
        await _FornecedorService.GetFornecedorAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateFornecedorAsync(
      CreateFornecedorRequest request
    )
    {
      try
      {
        Response<Guid> result = await _FornecedorService.CreateFornecedorAsync(request);
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
    public async Task<IActionResult> UpdateFornecedorAsync(
      UpdateFornecedorRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _FornecedorService.UpdateFornecedorAsync(
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
    public async Task<IActionResult> DeleteFornecedorAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _FornecedorService.DeleteFornecedorAsync(id);
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
    public async Task<IActionResult> DeleteMultipleFornecedoresAsync(
      [FromBody] DeleteMultipleFornecedorRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _FornecedorService.DeleteMultipleFornecedoresAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}


