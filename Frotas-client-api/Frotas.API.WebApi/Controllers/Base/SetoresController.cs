using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.SetorService;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/setores")]
  [ApiController]
  public class SetoresController(ISetorService SetorService) : ControllerBase
  {
    private readonly ISetorService _SetorService = SetorService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetSetoresAsync(string keyword = "")
    {
      Response<IEnumerable<SetorDTO>> result = await _SetorService.GetSetoresAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetSetoresPaginatedAsync(SetorTableFilter filter)
    {
      PaginatedResponse<SetorDTO> result = await _SetorService.GetSetoresPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSetorAsync(Guid id)
    {
      Response<SetorDTO> result = await _SetorService.GetSetorAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateSetorAsync(CreateSetorRequest request)
    {
      try
      {
        Response<Guid> result = await _SetorService.CreateSetorAsync(request);
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
    public async Task<IActionResult> UpdateSetorAsync(UpdateSetorRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _SetorService.UpdateSetorAsync(request, id);
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
    public async Task<IActionResult> DeleteSetorAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _SetorService.DeleteSetorAsync(id);
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
    public async Task<IActionResult> DeleteMultipleSetoresAsync(
      [FromBody] DeleteMultipleSetorRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _SetorService.DeleteMultipleSetoresAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
