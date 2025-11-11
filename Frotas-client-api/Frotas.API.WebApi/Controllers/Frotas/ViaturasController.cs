using System;
using System.Collections.Generic;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ViaturaService;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/viaturas")]
  [ApiController]
  public class ViaturasController(IViaturaService viaturaService) : ControllerBase
  {
    private readonly IViaturaService _viaturaService = viaturaService;

    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetViaturasAsync(string keyword = "")
    {
      Response<IEnumerable<ViaturaDTO>> result =
        await _viaturaService.GetViaturasAsync(keyword);
      return Ok(result);
    }

    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetViaturasPaginatedAsync(ViaturaTableFilter filter)
    {
      PaginatedResponse<ViaturaDTO> result =
        await _viaturaService.GetViaturasPaginatedAsync(filter);
      return Ok(result);
    }

    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetViaturaAsync(Guid id)
    {
      Response<ViaturaDTO> result = await _viaturaService.GetViaturaAsync(id);
      return Ok(result);
    }

    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateViaturaAsync(CreateViaturaRequest request)
    {
      try
      {
        Response<Guid> result = await _viaturaService.CreateViaturaAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateViaturaAsync(UpdateViaturaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _viaturaService.UpdateViaturaAsync(request, id);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteViaturaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _viaturaService.DeleteViaturaAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "client")]
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteMultipleViaturasAsync(
      [FromBody] DeleteMultipleViaturaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _viaturaService.DeleteMultipleViaturasAsync(request.Ids);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}

