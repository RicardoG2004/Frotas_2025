using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EntidadeContactoService;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeContactoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GACloud.API.WebApi.Controllers.Base
{
  [Route("client/base/[controller]")]
  [ApiController]
  public class EntidadeContactosController(IEntidadeContactoService EntidadeContactoService)
    : ControllerBase
  {
    private readonly IEntidadeContactoService _EntidadeContactoService = EntidadeContactoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetEntidadeContactosAsync(string keyword = "")
    {
      Response<IEnumerable<EntidadeContactoDTO>> result =
        await _EntidadeContactoService.GetEntidadeContactosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetEntidadeContactosPaginatedAsync(
      EntidadeContactoTableFilter filter
    )
    {
      PaginatedResponse<EntidadeContactoDTO> result =
        await _EntidadeContactoService.GetEntidadeContactosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEntidadeContactoAsync(Guid id)
    {
      Response<EntidadeContactoDTO> result =
        await _EntidadeContactoService.GetEntidadeContactoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateEntidadeContactoAsync(
      CreateEntidadeContactoRequest request
    )
    {
      try
      {
        Response<Guid> result = await _EntidadeContactoService.CreateEntidadeContactoAsync(request);
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
    public async Task<IActionResult> UpdateEntidadeContactoAsync(
      UpdateEntidadeContactoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _EntidadeContactoService.UpdateEntidadeContactoAsync(
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
    public async Task<IActionResult> DeleteEntidadeContactoAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _EntidadeContactoService.DeleteEntidadeContactoAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // bulk create
    [Authorize(Roles = "client")]
    [HttpPost("bulk")]
    public async Task<IActionResult> CreateEntidadeContactoBulkAsync(
      CreateEntidadeContactoBulkRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> result =
          await _EntidadeContactoService.CreateEntidadeContactoBulkAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // bulk update
    [Authorize(Roles = "client")]
    [HttpPut("bulk")]
    public async Task<IActionResult> UpdateEntidadeContactoBulkAsync(
      UpdateEntidadeContactoBulkRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> result =
          await _EntidadeContactoService.UpdateEntidadeContactoBulkAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // bulk upsert
    [Authorize(Roles = "client")]
    [HttpPost("upsert")]
    public async Task<IActionResult> UpsertEntidadeContactoBulkAsync(
      UpsertEntidadeContactoBulkRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> result =
          await _EntidadeContactoService.UpsertEntidadeContactoBulkAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
