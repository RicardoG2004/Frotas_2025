using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TaxaIvaService;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;
using Frotas.API.Application.Services.Base.TaxaIvaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Base
{
  [Route("client/base/taxas-iva")]
  [ApiController]
  public class TaxasIvaController(ITaxaIvaService TaxaIvaService) : ControllerBase
  {
    private readonly ITaxaIvaService _TaxaIvaService = TaxaIvaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetTaxasIvaAsync(string keyword = "")
    {
      Response<IEnumerable<TaxaIvaDTO>> result = await _TaxaIvaService.GetTaxasIvaAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetTaxasIvaPaginatedAsync(TaxaIvaTableFilter filter)
    {
      PaginatedResponse<TaxaIvaDTO> result = await _TaxaIvaService.GetTaxasIvaPaginatedAsync(
        filter
      );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaxaIvaAsync(Guid id)
    {
      Response<TaxaIvaDTO> result = await _TaxaIvaService.GetTaxaIvaAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]
    public async Task<IActionResult> CreateTaxaIvaAsync(CreateTaxaIvaRequest request)
    {
      try
      {
        Response<Guid> result = await _TaxaIvaService.CreateTaxaIvaAsync(request);
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
    public async Task<IActionResult> UpdateTaxaIvaAsync(UpdateTaxaIvaRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _TaxaIvaService.UpdateTaxaIvaAsync(request, id);
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
    public async Task<IActionResult> DeleteTaxaIvaAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _TaxaIvaService.DeleteTaxaIvaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleTaxasIvaAsync(
      [FromBody] DeleteMultipleTaxaIvaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _TaxaIvaService.DeleteMultipleTaxasIvaAsync(request.Ids);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
