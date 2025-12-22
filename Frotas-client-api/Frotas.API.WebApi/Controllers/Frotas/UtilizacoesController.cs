using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.UtilizacaoService;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.DTOs;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResponseStatus = Frotas.API.Application.Common.Wrapper.ResponseStatus;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/utilizacoes")]
  [ApiController]
  public class UtilizacoesController(
    IUtilizacaoService UtilizacaoService
  ) : ControllerBase
  {
    private readonly IUtilizacaoService _UtilizacaoService = UtilizacaoService;

    // full list
    [Authorize(Roles = "client")]
    [HttpGet]
    public async Task<IActionResult> GetUtilizacoesAsync(string keyword = "")
    {
      Response<IEnumerable<UtilizacaoDTO>> result =
        await _UtilizacaoService.GetUtilizacoesAsync(keyword);
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "client")]
    [HttpPost("paginated")]
    public async Task<IActionResult> GetUtilizacoesPaginatedAsync(
      UtilizacaoTableFilter filter
    )
    {
      PaginatedResponse<UtilizacaoDTO> result =
        await _UtilizacaoService.GetUtilizacoesPaginatedAsync(
          filter
        );
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "client")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUtilizacaoAsync(Guid id)
    {
      Response<UtilizacaoDTO> result =
        await _UtilizacaoService.GetUtilizacaoAsync(id);
      return Ok(result);
    }

    // get by Funcionario
    [Authorize(Roles = "client")]
    [HttpGet("funcionario/{funcionarioId}")]
    public async Task<IActionResult> GetUtilizacoesByFuncionarioAsync(Guid funcionarioId)
    {
      Response<IEnumerable<UtilizacaoDTO>> result =
        await _UtilizacaoService.GetUtilizacoesByFuncionarioAsync(funcionarioId);
      return Ok(result);
    }

    // get by Date
    [Authorize(Roles = "client")]
    [HttpGet("data/{dataUtilizacao}")]
    public async Task<IActionResult> GetUtilizacoesByDateAsync([FromRoute] string dataUtilizacao)
    {
      if (DateTime.TryParse(dataUtilizacao, out DateTime date))
      {
        Response<IEnumerable<UtilizacaoDTO>> result =
          await _UtilizacaoService.GetUtilizacoesByDateAsync(date);
        return Ok(result);
      }
      return BadRequest("Formato de data inválido");
    }

    // create
    [Authorize(Roles = "client")]
    [HttpPost]  
    public async Task<IActionResult> CreateUtilizacaoAsync(
      [FromBody] CreateUtilizacaoRequestDto? dto
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
        if (string.IsNullOrWhiteSpace(dto.DataUtilizacao) || !DateTime.TryParse(dto.DataUtilizacao, out DateTime dataUtilizacao))
        {
          return BadRequest(Response<Guid>.Fail("Formato de data inválido. Use o formato yyyy-MM-dd."));
        }

        // Convert string Guid to Guid
        if (string.IsNullOrWhiteSpace(dto.FuncionarioId) || !Guid.TryParse(dto.FuncionarioId, out Guid funcionarioId))
        {
          return BadRequest(Response<Guid>.Fail("ID de funcionário inválido."));
        }

        // Convert string Guid to Guid (ViaturaId is now required)
        if (string.IsNullOrWhiteSpace(dto.ViaturaId) || !Guid.TryParse(dto.ViaturaId, out Guid viaturaId))
        {
          return BadRequest(Response<Guid>.Fail("ID de viatura inválido. A viatura é obrigatória."));
        }

        // Convert string date to DateTime (optional)
        DateTime? dataUltimaConferencia = null;
        if (!string.IsNullOrWhiteSpace(dto.DataUltimaConferencia) && DateTime.TryParse(dto.DataUltimaConferencia, out DateTime parsedDataUltimaConferencia))
        {
          dataUltimaConferencia = parsedDataUltimaConferencia;
        }

        CreateUtilizacaoRequest request = new()
        {
          DataUtilizacao = dataUtilizacao,
          DataUltimaConferencia = dataUltimaConferencia,
          FuncionarioId = funcionarioId,
          ViaturaId = viaturaId,
          HoraInicio = dto.HoraInicio,
          HoraFim = dto.HoraFim,
          ValorCombustivel = dto.ValorCombustivel,
          KmPartida = dto.KmPartida,
          KmChegada = dto.KmChegada,
          TotalKmEfectuados = dto.TotalKmEfectuados,
          TotalKmConferidos = dto.TotalKmConferidos,
          TotalKmAConferir = dto.TotalKmAConferir,
          Causa = dto.Causa,
          Observacoes = dto.Observacoes,
        };

        Response<Guid> result =
          await _UtilizacaoService.CreateUtilizacaoAsync(request);
        
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
    // This DTO is only used for deserialization, validation happens on CreateUtilizacaoRequest
    [ApiExplorerSettings(IgnoreApi = false)]
    public class CreateUtilizacaoRequestDto
    {
      public string DataUtilizacao { get; set; } = string.Empty;
      public string? DataUltimaConferencia { get; set; }
      public string FuncionarioId { get; set; } = string.Empty;
      public string ViaturaId { get; set; } = string.Empty;
      public string? HoraInicio { get; set; }
      public string? HoraFim { get; set; }
      public decimal? ValorCombustivel { get; set; }
      public decimal? KmPartida { get; set; }
      public decimal? KmChegada { get; set; }
      public decimal? TotalKmEfectuados { get; set; }
      public decimal? TotalKmConferidos { get; set; }
      public decimal? TotalKmAConferir { get; set; }
      public string? Causa { get; set; }
      public string? Observacoes { get; set; }
    }

    // update
    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUtilizacaoAsync(
      UpdateUtilizacaoRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result =
          await _UtilizacaoService.UpdateUtilizacaoAsync(request, id);
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
    public async Task<IActionResult> DeleteUtilizacaoAsync(Guid id)
    {
      try
      {
        Response<Guid> response =
          await _UtilizacaoService.DeleteUtilizacaoAsync(id);
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
    public async Task<IActionResult> DeleteMultipleUtilizacoesAsync(
      [FromBody] DeleteMultipleUtilizacaoRequest request
    )
    {
      try
      {
        Response<IEnumerable<Guid>> response =
          await _UtilizacaoService.DeleteMultipleUtilizacoesAsync(
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

