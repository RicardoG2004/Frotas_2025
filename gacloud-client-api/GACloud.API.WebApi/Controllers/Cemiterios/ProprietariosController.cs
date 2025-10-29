using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Cemiterios
{
  [Route("client/cemiterios/proprietarios")]
  [ApiController]
  public class ProprietariosController(
    IProprietarioService ProprietarioService
  ) : ControllerBase
  {
    private readonly IProprietarioService _ProprietarioService =
      ProprietarioService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetProprietariosAsync(string keyword = "")
    {
      Response<IEnumerable<ProprietarioDTO>> result =
        await _ProprietarioService.GetProprietariosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetProprietariosPaginatedAsync(
      ProprietarioTableFilter filter
    )
    {
      PaginatedResponse<ProprietarioDTO> result =
        await _ProprietarioService.GetProprietariosAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProprietarioAsync(Guid id)
    {
      Response<ProprietarioDTO> result =
        await _ProprietarioService.GetProprietarioByIdAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateProprietarioAsync(
      CreateProprietarioRequest request
    )
    {
      try
      {
        Response<Guid> result =
          await _ProprietarioService.CreateProprietarioAsync(request);
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
    public async Task<IActionResult> UpdateProprietarioAsync(
      UpdateProprietarioRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _ProprietarioService.UpdateProprietarioAsync(request, id);
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
    public async Task<IActionResult> DeleteProprietarioAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _ProprietarioService.DeleteProprietarioAsync(id);
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
    public async Task<IActionResult> DeleteMultipleProprietariosAsync(
      [FromBody] DeleteMultipleProprietarioRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ProprietarioService.DeleteMultipleProprietariosAsync(request.Ids);

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
