using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using AutoMapper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService;
using GSLP.Application.Services.Platform.LicencaService;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Application.Services.Platform.LicencaService.Filters;
using GSLP.Application.Services.Platform.LicencaService.Helpers;
using GSLP.Application.Services.Platform.LicencaUtilizadorService;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using GSLP.WebApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Platform
{
  [Route("api/[controller]")]
  [ApiController]
  public class LicencasController : ControllerBase
  {
    private readonly ILicencaService _LicencaService;
    private readonly ILicencaModuloService _LicencaModuloService;
    private readonly ILicencaFuncionalidadeService _LicencaFuncionalidadeService;
    private readonly ILicencaUtilizadorService _LicencaUtilizadorService;
    private readonly IPerfilUtilizadorService _PerfilUtilizadorService;
    private readonly IMapper _mapper;

    public LicencasController(
      ILicencaService LicencaService,
      ILicencaModuloService LicencaModuloService,
      ILicencaFuncionalidadeService LicencaFuncionalidadeService,
      ILicencaUtilizadorService LicencaUtilizadorService,
      IPerfilUtilizadorService PerfilUtilizadorService,
      IMapper mapper
    )
    {
      _LicencaService = LicencaService;
      _LicencaModuloService = LicencaModuloService;
      _LicencaFuncionalidadeService = LicencaFuncionalidadeService;
      _LicencaUtilizadorService = LicencaUtilizadorService;
      _PerfilUtilizadorService = PerfilUtilizadorService;
      _mapper = mapper;
    }

    #region [-- LICENCA --]

    // full list
    [Authorize(Roles = "root, administrator")]
    [HttpGet]
    public async Task<IActionResult> GetLicencasResponseAsync(string keyword = "")
    {
      Response<IEnumerable<LicencaDTO>> result = await _LicencaService.GetLicencasResponseAsync(
        keyword
      );
      return Ok(result);
    }

    // paginated & filtered list
    [Authorize(Roles = "root, administrator")]
    [HttpPost("Licencas-paginated")]
    public async Task<IActionResult> GetLicencasPaginatedResponseAsync(LicencaTableFilter filter)
    {
      PaginatedResponse<LicencaDTO> result =
        await _LicencaService.GetLicencasPaginatedResponseAsync(filter);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "root, administrator, admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLicencaResponseAsync(Guid id)
    {
      Response<LicencaDTO> result = await _LicencaService.GetLicencaResponseAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "root, administrator")]
    [HttpPost]
    public async Task<IActionResult> CreateLicencaResponseAsync(CreateLicencaRequest request)
    {
      try
      {
        Response<Guid> result = await _LicencaService.CreateLicencaResponseAsync(request);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // update
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLicencaResponseAsync(
      UpdateLicencaRequest request,
      Guid id
    )
    {
      try
      {
        Response<Guid> result = await _LicencaService.UpdateLicencaResponseAsync(request, id);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // delete
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLicencaResponseAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _LicencaService.DeleteLicencaResponseAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // get licenca by api key
    [Authorize(Roles = "root, administrator, admin, client")]
    [HttpGet("by-api-key")]
    public async Task<IActionResult> GetLicencaByAPIKeyResponseAsync()
    {
      Response<LicencaDTO> result = await _LicencaService.GetLicencaByAPIKeyResponseAsync();
      return Ok(result);
    }

    // get modulos and funcionalidades from licenca by licencaId
    [Authorize(Roles = "root, administrator, admin, client")]
    [HttpGet("{id}/modulos/funcionalidades")]
    public async Task<IActionResult> GetLicencaModulosFuncionalidadesByIdResponseAsync(Guid id)
    {
      Response<LicencaModulosFuncionalidadesDTO> result =
        await _LicencaService.GetLicencaModulosFuncionalidadesByIdResponseAsync(id);
      return Ok(result);
    }

    // get licencas by cliente id
    [Authorize(Roles = "root, administrator")]
    [HttpGet("by-cliente/{clienteId}")]
    public async Task<IActionResult> GetLicencasByClienteIdResponseAsync(Guid clienteId)
    {
      Response<IEnumerable<LicencaDTO>> result =
        await _LicencaService.GetLicencasByClienteIdResponseAsync(clienteId);
      return Ok(result);
    }

    // get all licenses from the client that owns the given license
    [Authorize(Roles = "root, administrator")]
    [HttpGet("{licencaId}/by-cliente")]
    public async Task<IActionResult> GetLicencasByLicencaIdResponseAsync(Guid licencaId)
    {
      Response<IEnumerable<LicencaDTO>> result =
        await _LicencaService.GetLicencasByLicencaIdResponseAsync(licencaId);
      return Ok(result);
    }

    #endregion

    #region [-- LICENCAUTILIZADOR --]

    // add utilizador to licenca
    [Authorize(Roles = "root, administrator, admin")]
    [HttpPost("{licencaId}/utilizador/")]
    public async Task<IActionResult> AddUtilizadorToLicencaResponseAsync(
      Guid licencaId,
      LicencaUtilizadorAssociationRequest request
    )
    {
      Response<Guid> result = await _LicencaUtilizadorService.AddUtilizadorToLicencaResponseAsync(
        licencaId,
        request
      );
      return Ok(result);
    }

    // add utilizadores to licenca
    [Authorize(Roles = "root, administrator, admin")]
    [HttpPost("{licencaId}/utilizadores/")]
    public async Task<IActionResult> AddUtilizadoresToLicencaResponseAsync(
      Guid licencaId,
      List<LicencaUtilizadorAssociationRequest> requests
    )
    {
      Response<List<Guid>> result =
        await _LicencaUtilizadorService.AddUtilizadoresToLicencaResponseAsync(licencaId, requests);
      return Ok(result);
    }

    // remove utilizadores from licenca
    [Authorize(Roles = "root, administrator, admin")]
    [HttpDelete("{licencaId}/utilizadores/")]
    public async Task<IActionResult> RemoveUtilizadoresToLicencaResponseAsync(
      Guid licencaId,
      List<string> utilizadoresIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaUtilizadorService.RemoveUtilizadoresFromLicencaResponseAsync(
          licencaId,
          utilizadoresIds
        );
      return Ok(result);
    }

    // update utilizador state from licenca
    [Authorize(Roles = "root, administrator, admin")]
    [HttpPut("{licencaId}/utilizador/")]
    public async Task<IActionResult> UpdateLicencaUtilizadorAtivoResponseAsync(
      Guid licencaId,
      LicencaUtilizadorAssociationRequest request
    )
    {
      Response<Guid> result =
        await _LicencaUtilizadorService.UpdateLicencaUtilizadorStatusResponseAsync(
          licencaId,
          request
        );
      return Ok(result);
    }

    // update utilizadores state from licenca
    [Authorize(Roles = "root, administrator, admin")]
    [HttpPut("{licencaId}/utilizadores/")]
    public async Task<IActionResult> UpdateLicencaUtilizadoresAtivoResponseAsync(
      Guid licencaId,
      List<LicencaUtilizadorAssociationRequest> requests
    )
    {
      Response<List<Guid>> result =
        await _LicencaUtilizadorService.UpdateLicencaUtilizadoresStatusResponseAsync(
          licencaId,
          requests
        );
      return Ok(result);
    }

    // get licenca by api key
    [Authorize(Roles = "root, administrator, admin")]
    [HttpGet("{licencaId}/utilizadores")]
    public async Task<IActionResult> GetLicencaUtilizadoresByLicencaIdResponseAsync(
      Guid licencaId,
      [FromQuery] string? role = null
    )
    {
      Response<IEnumerable<LicencaUtilizadorDTO>> result =
        await _LicencaUtilizadorService.GetUtilizadoresByLicencaIdResponseAsync(licencaId, role);
      return Ok(result);
    }

    #endregion

    #region [-- LICENCAMODULO --]

    // add modulo to licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPost("{licencaId}/modulos/{moduloId}")]
    public async Task<IActionResult> AddModuloToLicencaResponseAsync(Guid licencaId, Guid moduloId)
    {
      Response<Guid> result = await _LicencaModuloService.AddModuloToLicencaResponseAsync(
        licencaId,
        moduloId
      );
      return Ok(result);
    }

    // add modulos to licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPost("{licencaId}/modulos/")]
    public async Task<IActionResult> AddModulosToLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> modulosIds
    )
    {
      Response<List<Guid>> result = await _LicencaModuloService.AddModulosToLicencaResponseAsync(
        licencaId,
        modulosIds
      );
      return Ok(result);
    }

    // remove modulo from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{licencaId}/modulos/{moduloId}")]
    public async Task<IActionResult> RemoveModuloFromLicencaResponseAsync(
      Guid licencaId,
      Guid moduloId
    )
    {
      Response<Guid> result = await _LicencaModuloService.RemoveModuloFromLicencaResponseAsync(
        licencaId,
        moduloId
      );
      return Ok(result);
    }

    // remove modulos from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{licencaId}/modulos/")]
    public async Task<IActionResult> RemoveModulosFromLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> modulosIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaModuloService.RemoveModulosFromLicencaResponseAsync(licencaId, modulosIds);
      return Ok(result);
    }

    // update modulos from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{licencaId}/modulos/")]
    public async Task<IActionResult> UpdateModulosFromLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> modulosIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaModuloService.UpdateModulosFromLicencaResponseAsync(licencaId, modulosIds);
      return Ok(result);
    }

    // Block a Licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{licencaId}/block")]
    public async Task<IActionResult> BlockLicenca(
      Guid licencaId,
      [FromBody] BlockLicencaRequestDTO request // Reason for blocking (optional)
    )
    {
      Response<Guid> response = await _LicencaService.ToggleLicencaBlockStatusResponseAsync(
        licencaId,
        true,
        request.MotivoBloqueio
      );
      return Ok(response);
    }

    // Unblock a Licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{licencaId}/unblock")]
    public async Task<IActionResult> UnblockLicenca(Guid licencaId)
    {
      Response<Guid> response = await _LicencaService.ToggleLicencaBlockStatusResponseAsync(
        licencaId,
        false
      );
      return Ok(response);
    }

    // Update license version after update completion (for updater service)
    // Authentication is handled via secure API key validation - only specific API keys are allowed
    [AllowAnonymous]
    [SecureDownloadApiKey]
    [HttpPut("{licencaId}/versao")]
    public async Task<IActionResult> UpdateLicencaVersaoAsync(
      Guid licencaId,
      [FromBody] UpdateLicencaVersaoRequest request
    )
    {
      try
      {
        Response<Guid> result = await _LicencaService.UpdateLicencaVersaoResponseAsync(
          licencaId,
          request.Versao
        );
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    #endregion

    #region [-- LICENCAFUNCIONALIDADE --]

    // add funcionalidade to licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPost("{licencaId}/funcionalidades/{funcionalidadeId}")]
    public async Task<IActionResult> AddFuncionalidadeToLicencaResponseAsync(
      Guid licencaId,
      Guid funcionalidadeId
    )
    {
      Response<Guid> result =
        await _LicencaFuncionalidadeService.AddFuncionalidadeToLicencaResponseAsync(
          licencaId,
          funcionalidadeId
        );
      return Ok(result);
    }

    // add funcionalidades to licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPost("{licencaId}/funcionalidades/")]
    public async Task<IActionResult> AddFuncionalidadesToLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> funcionalidadesIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaFuncionalidadeService.AddFuncionalidadesToLicencaResponseAsync(
          licencaId,
          funcionalidadesIds
        );
      return Ok(result);
    }

    // remove funcionalidade from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{licencaId}/funcionalidades/{funcionalidadeId}")]
    public async Task<IActionResult> RemoveFuncionalidadeFromLicencaResponseAsync(
      Guid licencaId,
      Guid funcionalidadeId
    )
    {
      Response<Guid> result =
        await _LicencaFuncionalidadeService.RemoveFuncionalidadeFromLicencaResponseAsync(
          licencaId,
          funcionalidadeId
        );
      return Ok(result);
    }

    // remove funcionalidades from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{licencaId}/funcionalidades/")]
    public async Task<IActionResult> RemoveFuncionalidadesFromLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> funcionalidadesIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaFuncionalidadeService.RemoveFuncionalidadesFromLicencaResponseAsync(
          licencaId,
          funcionalidadesIds
        );
      return Ok(result);
    }

    // update funcionalidades from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{licencaId}/funcionalidades/")]
    public async Task<IActionResult> UpdateFuncionalidadesFromLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<Guid> funcionalidadesIds
    )
    {
      Response<List<Guid>> result =
        await _LicencaFuncionalidadeService.UpdateFuncionalidadesFromLicencaResponseAsync(
          licencaId,
          funcionalidadesIds
        );
      return Ok(result);
    }

    // update modulos and funcionalidades from licenca
    [Authorize(Roles = "root, administrator")]
    [HttpPut("{licencaId}/modulos/funcionalidades/")]
    public async Task<IActionResult> UpdateModulosFuncionalidadesFromLicencaResponseAsync(
      Guid licencaId,
      [FromBody] List<UpdateModulosFuncionalidadesRequest> request
    )
    {
      Response<List<Guid>> result =
        await _LicencaFuncionalidadeService.UpdateModulosFuncionalidadesFromLicencaResponseAsync(
          licencaId,
          request
        );
      return Ok(result);
    }

    #endregion

    [Authorize(Roles = "root, administrator")]
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> DeleteLicencasAsync([FromBody] DeleteLicencasRequest request)
    {
      try
      {
        if (request?.Ids == null || request.Ids.Count == 0)
        {
          return BadRequest(Response<List<Guid>>.Fail("A lista de IDs não pode estar vazia"));
        }

        Response<List<Guid>> response = await _LicencaService.DeleteLicencasAsync(request.Ids);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    [Authorize(Roles = "root, administrator, admin")]
    [HttpGet("{licencaId}/perfis/utilizadores")]
    public async Task<IActionResult> GetUtilizadoresByPerfilFromLicencaAsync(
      Guid licencaId,
      [FromQuery] string? role = null
    )
    {
      try
      {
        var licenca = await _LicencaService.GetLicencaResponseAsync(licencaId);
        if (!licenca.Succeeded)
        {
          return BadRequest(licenca.Messages);
        }

        var result = new LicencaPerfilUtilizadoresDTO { Perfis = [] };

        foreach (var perfil in licenca.Data.Perfis)
        {
          var utilizadores = await _PerfilUtilizadorService.GetUtilizadoresByPerfilIdResponseAsync(
            Guid.Parse(perfil.Id),
            role
          );

          if (utilizadores.Succeeded)
          {
            var perfilWithUsers = _mapper.Map<PerfilWithUtilizadoresDTO>(perfil);
            perfilWithUsers.Utilizadores = [.. utilizadores.Data];
            result.Perfis.Add(perfilWithUsers);
          }
        }

        return Ok(Response<LicencaPerfilUtilizadoresDTO>.Success(result));
      }
      catch (Exception ex)
      {
        return BadRequest(Response<LicencaPerfilUtilizadoresDTO>.Fail(ex.Message));
      }
    }

    // download updater configuration JSON file
    [Authorize(Roles = "root, administrator")]
    [HttpPost("download-updater-config")]
    public async Task<IActionResult> DownloadUpdaterConfigurationAsync(
      [FromBody] DeleteLicencasRequest request
    )
    {
      try
      {
        if (request?.Ids == null || request.Ids.Count == 0)
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("A lista de IDs não pode estar vazia")
          );
        }

        Response<UpdaterConfigurationDTO> configResponse =
          await _LicencaService.GetUpdaterConfigurationResponseAsync(request.Ids);

        if (!configResponse.Succeeded || configResponse.Data == null)
        {
          return BadRequest(configResponse);
        }

        // Get client name from first license for filename
        string? clienteNome = null;
        if (request.Ids.Count > 0)
        {
          Response<LicencaDTO> firstLicencaResponse = await _LicencaService.GetLicencaResponseAsync(
            request.Ids[0]
          );
          if (firstLicencaResponse.Succeeded && firstLicencaResponse.Data?.Cliente != null)
          {
            clienteNome = firstLicencaResponse.Data.Cliente.Nome;
          }
        }

        // Generate filename with client slug
        string fileName = UpdaterConfigHelper.GenerateFilename(clienteNome);

        // Serialize to JSON (PascalCase for property names)
        // Use UnsafeRelaxedJsonEscaping to prevent escaping of characters like +, /, =
        string json = JsonSerializer.Serialize(
          configResponse.Data,
          new JsonSerializerOptions
          {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
          }
        );

        // Convert to bytes
        byte[] fileBytes = Encoding.UTF8.GetBytes(json);

        // Return as file download
        return File(fileBytes, "application/json", fileName);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // download frontend configuration JSON file
    [Authorize(Roles = "root, administrator")]
    [HttpPost("download-frontend-config")]
    public async Task<IActionResult> DownloadFrontendConfigAsync(
      [FromBody] DownloadFrontendConfigRequest request
    )
    {
      try
      {
        if (request?.Id == null || string.IsNullOrEmpty(request.Id))
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("O ID da licença não pode estar vazio")
          );
        }

        if (!Guid.TryParse(request.Id, out Guid licencaId))
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("ID da licença inválido")
          );
        }

        Response<FrontendConfigDTO> configResponse =
          await _LicencaService.GetFrontendConfigResponseAsync(licencaId);

        if (!configResponse.Succeeded || configResponse.Data == null)
        {
          if (configResponse.Messages != null && configResponse.Messages.Any())
          {
            string errorMessage = string.Join(", ", configResponse.Messages);
            if (errorMessage.Contains("não encontrada"))
            {
              return NotFound(
                GSLP.Application.Common.Wrapper.Response.Fail(errorMessage)
              );
            }
            if (errorMessage.Contains("API key"))
            {
              return BadRequest(
                GSLP.Application.Common.Wrapper.Response.Fail(errorMessage)
              );
            }
          }
          return BadRequest(configResponse);
        }

        // Get license name for filename
        string? licenseName = null;
        Response<LicencaDTO> licencaResponse = await _LicencaService.GetLicencaResponseAsync(
          licencaId
        );
        if (licencaResponse.Succeeded && licencaResponse.Data != null)
        {
          licenseName = licencaResponse.Data.Nome;
        }

        // Generate filename with license slug
        string fileName = FrontendConfigHelper.GenerateFilename(licenseName);

        // Serialize to JSON (PascalCase for property names)
        // Use UnsafeRelaxedJsonEscaping to prevent escaping of characters like +, /, =
        string json = JsonSerializer.Serialize(
          configResponse.Data,
          new JsonSerializerOptions
          {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
          }
        );

        // Convert to bytes
        byte[] fileBytes = Encoding.UTF8.GetBytes(json);

        // Return as file download
        return File(fileBytes, "application/json", fileName);
      }
      catch (Exception ex)
      {
        return StatusCode(
          500,
          GSLP.Application.Common.Wrapper.Response.Fail($"Erro ao gerar configuração: {ex.Message}")
        );
      }
    }

    // download API configuration JSON file (appsettings.json)
    [Authorize(Roles = "root, administrator")]
    [HttpPost("download-api-config")]
    public async Task<IActionResult> DownloadApiConfigAsync(
      [FromBody] DownloadApiConfigRequest request
    )
    {
      try
      {
        if (request?.Id == null || string.IsNullOrEmpty(request.Id))
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("O ID da licença não pode estar vazio")
          );
        }

        if (!Guid.TryParse(request.Id, out Guid licencaId))
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("ID da licença inválido")
          );
        }

        Response<ApiConfigDTO> configResponse =
          await _LicencaService.GetApiConfigResponseAsync(licencaId);

        if (!configResponse.Succeeded || configResponse.Data == null)
        {
          if (configResponse.Messages != null && configResponse.Messages.Any())
          {
            string errorMessage = string.Join(", ", configResponse.Messages);
            if (errorMessage.Contains("não encontrada"))
            {
              return NotFound(
                GSLP.Application.Common.Wrapper.Response.Fail(errorMessage)
              );
            }
          }
          return BadRequest(configResponse);
        }

        // Get license name for filename
        string? licenseName = null;
        Response<LicencaDTO> licencaResponse = await _LicencaService.GetLicencaResponseAsync(
          licencaId
        );
        if (licencaResponse.Succeeded && licencaResponse.Data != null)
        {
          licenseName = licencaResponse.Data.Nome;
        }

        // Generate filename with license slug
        string fileName = ApiConfigHelper.GenerateFilename(licenseName);

        // Serialize to JSON (PascalCase for property names)
        // Use UnsafeRelaxedJsonEscaping to prevent escaping of characters like +, /, =
        string json = JsonSerializer.Serialize(
          configResponse.Data,
          new JsonSerializerOptions
          {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
          }
        );

        // Convert to bytes
        byte[] fileBytes = Encoding.UTF8.GetBytes(json);

        // Return as file download
        return File(fileBytes, "application/json", fileName);
      }
      catch (Exception ex)
      {
        return StatusCode(
          500,
          GSLP.Application.Common.Wrapper.Response.Fail($"Erro ao gerar configuração: {ex.Message}")
        );
      }
    }
  }
}
