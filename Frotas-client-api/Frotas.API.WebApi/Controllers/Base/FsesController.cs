using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FseService;
using Frotas.API.Application.Services.Base.FseService.DTOs;
using Frotas.API.Application.Services.Base.FseService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/fses")]
  [ApiController]
  public class FsesController : ControllerBase
  {
    private readonly IFseService _fseService;

    public FsesController(IFseService fseService)
    {
      _fseService = fseService;
    }

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetFsesAsync(string keyword = "")
    {
        Response<IEnumerable<FseDTO>> result = await _fseService.GetFsesAsync(keyword);
        return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetFsesPaginatedAsync(FseTableFilter filter)
    {
        PaginatedResponse<FseDTO> result = await _fseService.GetFsesPaginatedAsync(filter);
        return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFseAsync(Guid id)
    {
        Response<FseDTO> result = await _fseService.GetFseAsync(id);
        return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateFseAsync(CreateFseRequest request)
    {
        try
        {
            Response<Guid> result = await _fseService.CreateFseAsync(request);
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
    public async Task<IActionResult> UpdateFseAsync(UpdateFseRequest request, Guid id)
    {
        try
        {
            Response<Guid> result = await _fseService.UpdateFseAsync(request, id);
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
    public async Task<IActionResult> DeleteFseAsync(Guid id)
    {
        try
        {
            Response<Guid> response = await _fseService.DeleteFseAsync(id);
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
    public async Task<IActionResult> DeleteMultipleFsesAsync([FromBody] DeleteMultipleFseRequest request)
    {
        try
        {
            Response<IEnumerable<Guid>> response = await _fseService.DeleteMultipleFsesAsync(request.Ids);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
  }
}