using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResponseStatus = Frotas.API.Application.Common.Wrapper.ResponseStatus;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/reservas-oficinas")]
  [ApiController]
  public class ReservasOficinasController(
    IReservaOficinaService ReservaOficinaService
  ) : ControllerBase
  {
    private readonly IReservaOficinaService _ReservaOficinaService = ReservaOficinaService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetReservasOficinasAsync(string keyword = "")
    {
      Response<IEnumerable<ReservaOficinaDTO>> result =
        await _ReservaOficinaService.GetReservasOficinaAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetReservasOficinasPaginatedAsync(
      ReservaOficinaTableFilter filter
    )
    {
      PaginatedResponse<ReservaOficinaDTO> result =
        await _ReservaOficinaService.GetReservasOficinaPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReservaOficinaAsync(Guid id)
    {
      Response<ReservaOficinaDTO> result =
        await _ReservaOficinaService.GetReservaOficinaAsync(id);
      return Ok(result);
    }

    // get by Funcionario
    [Authorize(Roles = "client")]
    [HttpGet("funcionario/{funcionarioId}")]
    public async Task<IActionResult> GetReservasOficinasByFuncionarioAsync(Guid funcionarioId)
    {
      Response<IEnumerable<ReservaOficinaDTO>> result =
        await _ReservaOficinaService.GetReservasOficinaByFuncionarioAsync(funcionarioId);
      return Ok(result);
    }

    // get by Date
    [Authorize(Roles = "client")]
    [HttpGet("data/{dataReserva}")]
    public async Task<IActionResult> GetReservasOficinasByDateAsync([FromRoute] string dataReserva)
    {
      if (DateTime.TryParse(dataReserva, out DateTime date))
      {
        Response<IEnumerable<ReservaOficinaDTO>> result =
          await _ReservaOficinaService.GetReservasOficinaByDateAsync(date);
        return Ok(result);
      }
      return BadRequest("Formato de data inválido");
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreateReservaOficinaAsync(
      [FromBody] CreateReservaOficinaRequestDto? dto
    )
    {
      try
      {
        // Validate ModelState (FluentValidation automatic validation)
        if (!ModelState.IsValid)
        {
          var errors = ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .SelectMany(x => x.Value!.Errors.Select(e => e.ErrorMessage))
            .ToList();
          var errorMessage = string.Join("; ", errors);
          return BadRequest(Response<Guid>.Fail($"Erro de validação: {errorMessage}"));
        }

        if (dto == null)
        {
          return BadRequest(Response<Guid>.Fail("Dados da requisição não podem ser nulos."));
        }

        // Convert string date to DateTime
        if (string.IsNullOrWhiteSpace(dto.DataReserva) || !DateTime.TryParse(dto.DataReserva, out DateTime dataReserva))
        {
          return BadRequest(Response<Guid>.Fail("Formato de data inválido. Use o formato yyyy-MM-dd."));
        }

        // Convert string Guid to Guid
        if (string.IsNullOrWhiteSpace(dto.FuncionarioId) || !Guid.TryParse(dto.FuncionarioId, out Guid funcionarioId))
        {
          return BadRequest(Response<Guid>.Fail("ID de funcionário inválido."));
        }

        Guid? viaturaId = null;
        if (!string.IsNullOrWhiteSpace(dto.ViaturaId))
        {
          if (!Guid.TryParse(dto.ViaturaId, out Guid parsedViaturaId))
          {
            return BadRequest(Response<Guid>.Fail("ID de viatura inválido."));
          }
          viaturaId = parsedViaturaId;
        }

        CreateReservaOficinaRequest request = new()
        {
          DataReserva = dataReserva,
          FuncionarioId = funcionarioId,
          ViaturaId = viaturaId,
          HoraInicio = dto.HoraInicio,
          HoraFim = dto.HoraFim,
          Causa = dto.Causa,
          Observacoes = dto.Observacoes,
        };

        Response<Guid> result =
          await _ReservaOficinaService.CreateReservaOficinaAsync(request);
        
        if (result.Status == ResponseStatus.Failure)
        {
          return BadRequest(result);
        }
        
        return Ok(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, Response<Guid>.Fail($"Erro interno do servidor: {ex.Message}. InnerException: {ex.InnerException?.Message}"));
      }
    }

    // DTO for receiving request with string dates
    // This DTO is only used for deserialization, validation happens on CreateReservaOficinaRequest
    [ApiExplorerSettings(IgnoreApi = false)]
    public class CreateReservaOficinaRequestDto
    {
      public string DataReserva { get; set; } = string.Empty;
      public string FuncionarioId { get; set; } = string.Empty;
      public string? ViaturaId { get; set; }
      public string? HoraInicio { get; set; }
      public string? HoraFim { get; set; }
      public string? Causa { get; set; }
      public string? Observacoes { get; set; }
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservaOficinaAsync(
      UpdateReservaOficinaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _ReservaOficinaService.UpdateReservaOficinaAsync(request, id);
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
    public async Task<IActionResult> DeleteReservaOficinaAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _ReservaOficinaService.DeleteReservaOficinaAsync(id);
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
    public async Task<IActionResult> DeleteMultipleReservasOficinasAsync(
      [FromBody] DeleteMultipleReservaOficinaRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _ReservaOficinaService.DeleteMultipleReservasOficinaAsync(
            request.Ids
          );

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}

