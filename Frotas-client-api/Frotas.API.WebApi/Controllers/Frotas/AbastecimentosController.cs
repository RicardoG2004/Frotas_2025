using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.AbastecimentoService;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResponseStatus = Frotas.API.Application.Common.Wrapper.ResponseStatus;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/abastecimentos")]
  [ApiController]
  public class AbastecimentosController(
    IAbastecimentoService AbastecimentoService
  ) : ControllerBase
  {
    private readonly IAbastecimentoService _AbastecimentoService = AbastecimentoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetAbastecimentosAsync(string keyword = "")
    {
      Response<IEnumerable<AbastecimentoDTO>> result =
        await _AbastecimentoService.GetAbastecimentosAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetAbastecimentosPaginatedAsync(
      AbastecimentoTableFilter filter
    )
    {
      PaginatedResponse<AbastecimentoDTO> result =
        await _AbastecimentoService.GetAbastecimentosPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAbastecimentoAsync(Guid id)
    {
      Response<AbastecimentoDTO> result =
        await _AbastecimentoService.GetAbastecimentoAsync(id);
      return Ok(result);
    }

    // get by Funcionario
    [Authorize(Roles = "client")]
    [HttpGet("funcionario/{funcionarioId}")]
    public async Task<IActionResult> GetAbastecimentosByFuncionarioAsync(Guid funcionarioId)
    {
      Response<IEnumerable<AbastecimentoDTO>> result =
        await _AbastecimentoService.GetAbastecimentosByFuncionarioAsync(funcionarioId);
      return Ok(result);
    }

    // get by Date
    [Authorize(Roles = "client")]
    [HttpGet("data/{data}")]
    public async Task<IActionResult> GetAbastecimentosByDateAsync([FromRoute] string data)
    {
      if (DateTime.TryParse(data, out DateTime date))
      {
        Response<IEnumerable<AbastecimentoDTO>> result =
          await _AbastecimentoService.GetAbastecimentosByDateAsync(date);
        return Ok(result);
      }
      return BadRequest("Formato de data inválido");
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreateAbastecimentoAsync(
      [FromBody] CreateAbastecimentoRequestDto? dto
    )
    {
      try
      {
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

        if (string.IsNullOrWhiteSpace(dto.Data) || !DateTime.TryParse(dto.Data, out DateTime data))
        {
          return BadRequest(Response<Guid>.Fail("Formato de data inválido. Use o formato yyyy-MM-dd."));
        }

        if (string.IsNullOrWhiteSpace(dto.FuncionarioId) || !Guid.TryParse(dto.FuncionarioId, out Guid funcionarioId))
        {
          return BadRequest(Response<Guid>.Fail("ID de funcionário inválido."));
        }

        if (string.IsNullOrWhiteSpace(dto.ViaturaId) || !Guid.TryParse(dto.ViaturaId, out Guid viaturaId))
        {
          return BadRequest(Response<Guid>.Fail("ID de viatura inválido. A viatura é obrigatória."));
        }

        CreateAbastecimentoRequest request = new()
        {
          Data = data,
          FuncionarioId = funcionarioId,
          ViaturaId = viaturaId,
          Kms = dto.Kms,
          Litros = dto.Litros,
          Valor = dto.Valor,
        };

        Response<Guid> result =
          await _AbastecimentoService.CreateAbastecimentoAsync(request);
        
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
    [ApiExplorerSettings(IgnoreApi = false)]
    public class CreateAbastecimentoRequestDto
    {
      public string Data { get; set; } = string.Empty;
      public string FuncionarioId { get; set; } = string.Empty;
      public string ViaturaId { get; set; } = string.Empty;
      public decimal? Kms { get; set; }
      public decimal? Litros { get; set; }
      public decimal? Valor { get; set; }
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAbastecimentoAsync(
      UpdateAbastecimentoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _AbastecimentoService.UpdateAbastecimentoAsync(request, id);
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
    public async Task<IActionResult> DeleteAbastecimentoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _AbastecimentoService.DeleteAbastecimentoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleAbastecimentosAsync(
      [FromBody] DeleteMultipleAbastecimentoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _AbastecimentoService.DeleteMultipleAbastecimentosAsync(
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

