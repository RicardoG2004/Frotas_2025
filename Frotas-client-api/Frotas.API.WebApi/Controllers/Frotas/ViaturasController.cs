using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ViaturaService;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/viaturas")]
  [ApiController]
  public class ViaturasController : ControllerBase
  {
    private readonly IViaturaService _viaturaService;
    private readonly ILogger<ViaturasController> _logger;

    public ViaturasController(IViaturaService viaturaService, ILogger<ViaturasController> logger)
    {
      _viaturaService = viaturaService;
      _logger = logger;
    }

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
        // Log do request recebido
        _logger.LogInformation($"[CreateViatura] Recebido request para criar viatura. Matricula: {request.Matricula}, MarcaId: {request.MarcaId?.ToString() ?? "null"}, ModeloId: {request.ModeloId?.ToString() ?? "null"}");
        
        if (!ModelState.IsValid)
        {
          var errorMessages = new Dictionary<string, List<string>>();
          foreach (var (key, value) in ModelState)
          {
            errorMessages[key] = value.Errors.Select(e => e.ErrorMessage).ToList();
          }
          
          _logger.LogWarning($"[CreateViatura] ModelState inválido. Erros: {JsonSerializer.Serialize(errorMessages)}");
          
          return BadRequest(new Response<Guid>
          {
            Status = ResponseStatus.Failure,
            Messages = errorMessages
          });
        }

        Response<Guid> result = await _viaturaService.CreateViaturaAsync(request);
        
        if (result.Status == ResponseStatus.Failure)
        {
          _logger.LogError($"[CreateViatura] Falha ao criar viatura. Erro: {JsonSerializer.Serialize(result.Messages)}");
          return BadRequest(result);
        }
        
        _logger.LogInformation($"[CreateViatura] Viatura criada com sucesso. ID: {result.Data}");
        return Ok(result);
      }
      catch (Exception ex)
      {
        string errorMessage = ex.Message;
        if (ex.InnerException != null)
        {
          errorMessage += " | Inner: " + ex.InnerException.Message;
        }
        
        _logger.LogError(ex, $"[CreateViatura] Exceção ao criar viatura. Mensagem: {errorMessage}");
        
        return BadRequest(new Response<Guid>
        {
          Status = ResponseStatus.Failure,
          Messages = new Dictionary<string, List<string>>
          {
            { "Error", new List<string> { errorMessage } }
          }
        });
      }
    }

    [Authorize(Roles = "client")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateViaturaAsync(UpdateViaturaRequest request, Guid id)
    {
      try
      {
        // Log do request recebido
        _logger.LogInformation($"[UpdateViatura] Recebido request para atualizar viatura {id}. Matricula: {request.Matricula}, MarcaId: {request.MarcaId?.ToString() ?? "null"}, ModeloId: {request.ModeloId?.ToString() ?? "null"}");
        
        // DEBUG: Log das inspeções recebidas
        _logger.LogInformation($"[UpdateViatura] Inspeções recebidas: {request.Inspecoes?.Count ?? 0}");
        if (request.Inspecoes != null)
        {
          foreach (var insp in request.Inspecoes)
          {
            _logger.LogInformation($"[UpdateViatura] Inspeção ID: {insp.Id}, Resultado: {insp.Resultado}, Documentos: {(string.IsNullOrEmpty(insp.Documentos) ? "VAZIO/NULL" : $"{insp.Documentos.Length} chars")}");
          }
        }
        
        if (!ModelState.IsValid)
        {
          var errorMessages = new Dictionary<string, List<string>>();
          foreach (var (key, value) in ModelState)
          {
            errorMessages[key] = value.Errors.Select(e => e.ErrorMessage).ToList();
          }
          
          _logger.LogWarning($"[UpdateViatura] ModelState inválido. Erros: {JsonSerializer.Serialize(errorMessages)}");
          
          return BadRequest(new Response<Guid>
          {
            Status = ResponseStatus.Failure,
            Messages = errorMessages
          });
        }

        Response<Guid> result = await _viaturaService.UpdateViaturaAsync(request, id);
        
        if (result.Status == ResponseStatus.Failure)
        {
          _logger.LogError($"[UpdateViatura] Falha ao atualizar viatura {id}. Erro: {JsonSerializer.Serialize(result.Messages)}");
          return BadRequest(result);
        }
        
        _logger.LogInformation($"[UpdateViatura] Viatura {id} atualizada com sucesso.");
        return Ok(result);
      }
      catch (Exception ex)
      {
        string errorMessage = ex.Message;
        string fullStackTrace = ex.StackTrace ?? "";
        
        if (ex.InnerException != null)
        {
          errorMessage += " | Inner: " + ex.InnerException.Message;
          if (!string.IsNullOrEmpty(ex.InnerException.StackTrace))
          {
            fullStackTrace += "\n\nInner StackTrace:\n" + ex.InnerException.StackTrace;
          }
        }
        
        _logger.LogError(ex, $"[UpdateViatura] Exceção ao atualizar viatura {id}. Mensagem: {errorMessage}");
        
        var errorResponse = new Response<Guid>
        {
          Status = ResponseStatus.Failure,
          Messages = new Dictionary<string, List<string>>
          {
            { "Error", new List<string> { errorMessage } },
            { "StackTrace", new List<string> { fullStackTrace.Substring(0, Math.Min(500, fullStackTrace.Length)) } }
          }
        };
        
        return BadRequest(errorResponse);
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

