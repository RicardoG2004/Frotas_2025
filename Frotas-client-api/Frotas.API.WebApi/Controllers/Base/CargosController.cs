using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CargoService;
using Frotas.API.Application.Services.Base.CargoService.DTOs;
using Frotas.API.Application.Services.Base.CargoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/cargos")]
  [ApiController]
  public class CargosController(ICargoService CargoService) : ControllerBase
  {
    private readonly ICargoService _CargoService = CargoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetCargosAsync(string keyword = "")
    {
      Response<IEnumerable<CargoDTO>> result =
        await _CargoService.GetCargosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetCargosPaginatedAsync(
      CargoTableFilter filter
    )
    {
      PaginatedResponse<CargoDTO> result =
        await _CargoService.GetCargosPaginatedAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCargoAsync(Guid id)
    {
      Response<CargoDTO> result =
        await _CargoService.GetCargoAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateCargoAsync(
      CreateCargoRequest request
    )
    {
      try
      {
        Response<Guid> result = await _CargoService.CreateCargoAsync(request);
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
    public async Task<IActionResult> UpdateCargoAsync(
      UpdateCargoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _CargoService.UpdateCargoAsync(
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
    public async Task<IActionResult> DeleteCargoAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _CargoService.DeleteCargoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleCargosAsync(
      [FromBody] DeleteMultipleCargoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _CargoService.DeleteMultipleCargosAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}


