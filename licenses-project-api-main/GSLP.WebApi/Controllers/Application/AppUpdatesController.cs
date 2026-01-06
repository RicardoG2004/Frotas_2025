using System.Security.Cryptography;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AppUpdateService;
using GSLP.Application.Services.Application.AppUpdateService.DTOs;
using GSLP.Application.Services.Application.AppUpdateService.Filters;
using GSLP.WebApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Application
{
  [Route("api/[controller]")]
  [ApiController]
  public class AppUpdatesController : ControllerBase
  {
    private readonly IAppUpdateService _appUpdateService;

    public AppUpdatesController(IAppUpdateService appUpdateService)
    {
      _appUpdateService = appUpdateService;
    }

    #region [-- APPUPDATE - ROUTES --]

    // get updates for an application (simple list)
    [Authorize(Roles = "root, administrator")]
    [HttpGet("aplicacao/{aplicacaoId}")]
    public async Task<IActionResult> GetAppUpdatesAsync(Guid aplicacaoId, string keyword = "")
    {
      Response<IEnumerable<AppUpdateDTO>> result =
        await _appUpdateService.GetAppUpdatesResponseAsync(aplicacaoId, keyword);
      return Ok(result);
    }

    // get paginated updates for an application (for frontend tables)
    [Authorize(Roles = "root, administrator")]
    [HttpPost("aplicacao/{aplicacaoId}/paginated")]
    public async Task<IActionResult> GetAppUpdatesPaginatedAsync(
      Guid aplicacaoId,
      AppUpdateTableFilter filter
    )
    {
      filter.AplicacaoId = aplicacaoId;
      PaginatedResponse<AppUpdateDTO> result =
        await _appUpdateService.GetAppUpdatesPaginatedResponseAsync(filter);
      return Ok(result);
    }

    // get update statistics for an application
    [Authorize(Roles = "root, administrator")]
    [HttpGet("aplicacao/{aplicacaoId}/statistics")]
    public async Task<IActionResult> GetAppUpdateStatisticsAsync(Guid aplicacaoId)
    {
      Response<AppUpdateStatisticsDTO> result =
        await _appUpdateService.GetAppUpdateStatisticsResponseAsync(aplicacaoId);
      return Ok(result);
    }

    // single by Id
    [Authorize(Roles = "root, administrator")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppUpdateAsync(Guid id)
    {
      Response<AppUpdateDTO> result = await _appUpdateService.GetAppUpdateResponseAsync(id);
      return Ok(result);
    }

    // create
    [Authorize(Roles = "root, administrator")]
    [HttpPost]
    public async Task<IActionResult> CreateAppUpdateAsync(CreateAppUpdateRequest request)
    {
      try
      {
        Response<Guid> result = await _appUpdateService.CreateAppUpdateResponseAsync(request);
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
    public async Task<IActionResult> UpdateAppUpdateAsync(UpdateAppUpdateRequest request, Guid id)
    {
      try
      {
        Response<Guid> result = await _appUpdateService.UpdateAppUpdateResponseAsync(request, id);
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
    public async Task<IActionResult> DeleteAppUpdateAsync(Guid id)
    {
      try
      {
        Response<Guid> response = await _appUpdateService.DeleteAppUpdateResponseAsync(id);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // upload update package file
    // packageType: null = legacy single file, 1 = API, 2 = Frontend (use when TipoUpdate is Both)
    [Authorize(Roles = "root, administrator")]
    [RequestSizeLimit(524288000)] // 500 MB limit
    [HttpPost("{id}/upload")]
    public async Task<IActionResult> UploadUpdatePackageAsync(
      Guid id,
      IFormFile file,
      [FromQuery] int? packageType = null
    )
    {
      try
      {
        if (file == null || file.Length == 0)
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("Ficheiro não fornecido")
          );
        }

        // Validate file extension (should be .zip)
        string fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (fileExtension != ".zip")
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("Apenas ficheiros ZIP são permitidos")
          );
        }

        // Validate file size (500 MB limit)
        const long maxFileSize = 524288000; // 500 MB in bytes
        if (file.Length > maxFileSize)
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail(
              $"O ficheiro excede o tamanho máximo permitido de {maxFileSize / 1024 / 1024} MB"
            )
          );
        }

        if (file.Length == 0)
        {
          return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail("O ficheiro está vazio"));
        }

        // Validate packageType if provided
        if (packageType.HasValue && packageType.Value != 1 && packageType.Value != 2)
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail(
              "packageType inválido. Use 1 para API ou 2 para Frontend"
            )
          );
        }

        // Get the update record
        Response<AppUpdateDTO> updateResponse = await _appUpdateService.GetAppUpdateResponseAsync(
          id
        );
        if (!updateResponse.Succeeded || updateResponse.Data == null)
        {
          return NotFound(GSLP.Application.Common.Wrapper.Response.Fail("Update não encontrado"));
        }

        // Validate packageType is required when TipoUpdate is Both
        if (
          updateResponse.Data.TipoUpdate == GSLP.Domain.Enums.UpdateType.Both
          && !packageType.HasValue
        )
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail(
              "packageType é obrigatório quando TipoUpdate é Both. Use 1 para API ou 2 para Frontend"
            )
          );
        }

        // Create Updates directory if it doesn't exist
        string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Updates");
        if (!Directory.Exists(directoryPath))
        {
          Directory.CreateDirectory(directoryPath);
        }

        // Generate unique filename with package type suffix
        string packageSuffix = packageType.HasValue
          ? (packageType.Value == 1 ? "_api" : "_frontend")
          : "";
        string fileName = $"{id}_{DateTime.UtcNow:yyyyMMddHHmmss}{packageSuffix}{fileExtension}";
        string filePath = Path.Combine(directoryPath, fileName);

        // Delete old file if exists (based on package type)
        string? oldFileName = null;
        if (
          packageType.HasValue
          && updateResponse.Data.TipoUpdate == GSLP.Domain.Enums.UpdateType.Both
        )
        {
          oldFileName =
            packageType.Value == 1
              ? updateResponse.Data.FicheiroUpdateApi
              : updateResponse.Data.FicheiroUpdateFrontend;
        }
        else
        {
          oldFileName = updateResponse.Data.FicheiroUpdate;
        }

        if (!string.IsNullOrEmpty(oldFileName))
        {
          string oldFilePath = Path.Combine(directoryPath, oldFileName);
          if (System.IO.File.Exists(oldFilePath))
          {
            System.IO.File.Delete(oldFilePath);
          }
        }

        // Save the new file
        using (System.IO.FileStream stream = new(filePath, System.IO.FileMode.Create))
        {
          await file.CopyToAsync(stream);
        }

        // Calculate file hash
        string fileHash = CalculateFileHash(filePath);

        // Update file info in the database
        Response<Guid> updateResult = await _appUpdateService.UpdateAppUpdateFileInfoResponseAsync(
          id,
          fileName,
          file.Length,
          fileHash,
          packageType
        );

        if (!updateResult.Succeeded)
        {
          // Delete the uploaded file if update failed
          if (System.IO.File.Exists(filePath))
          {
            System.IO.File.Delete(filePath);
          }
          return BadRequest(updateResult);
        }

        return Ok(
          Response<object>.Success(
            new
            {
              FileName = fileName,
              FileSize = file.Length,
              FileHash = fileHash,
              PackageType = packageType,
            }
          )
        );
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // delete update package file
    // packageType: null = legacy single file, 1 = API, 2 = Frontend (use when TipoUpdate is Both)
    [Authorize(Roles = "root, administrator")]
    [HttpDelete("{id}/package")]
    public async Task<IActionResult> DeleteUpdatePackageAsync(
      Guid id,
      [FromQuery] int? packageType = null
    )
    {
      try
      {
        Response<Guid> result = await _appUpdateService.DeleteAppUpdatePackageResponseAsync(
          id,
          packageType
        );
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // download update package (for client API and updater service)
    // Authentication is handled via secure API key validation - only specific API key is allowed
    // packageType: null = legacy single file, 1 = API, 2 = Frontend (use when TipoUpdate is Both)
    [AllowAnonymous]
    [SecureDownloadApiKey]
    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadUpdatePackageAsync(
      Guid id,
      [FromQuery] int? packageType = null
    )
    {
      try
      {
        Response<AppUpdateDTO> updateResponse = await _appUpdateService.GetAppUpdateResponseAsync(
          id
        );
        if (!updateResponse.Succeeded || updateResponse.Data == null)
        {
          return NotFound(GSLP.Application.Common.Wrapper.Response.Fail("Update não encontrado"));
        }

        // Determine which file to download based on TipoUpdate and packageType
        string? fileName = null;
        if (updateResponse.Data.TipoUpdate == GSLP.Domain.Enums.UpdateType.Both)
        {
          if (!packageType.HasValue)
          {
            return BadRequest(
              GSLP.Application.Common.Wrapper.Response.Fail(
                "packageType é obrigatório quando TipoUpdate é Both. Use 1 para API ou 2 para Frontend"
              )
            );
          }

          fileName =
            packageType.Value == 1
              ? updateResponse.Data.FicheiroUpdateApi
              : updateResponse.Data.FicheiroUpdateFrontend;
        }
        else
        {
          fileName = updateResponse.Data.FicheiroUpdate;
        }

        if (string.IsNullOrEmpty(fileName))
        {
          return BadRequest(
            GSLP.Application.Common.Wrapper.Response.Fail("Ficheiro de update não disponível")
          );
        }

        string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Updates");
        string filePath = Path.Combine(directoryPath, fileName);

        if (!System.IO.File.Exists(filePath))
        {
          return NotFound(GSLP.Application.Common.Wrapper.Response.Fail("Ficheiro não encontrado"));
        }

        byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        return File(fileBytes, "application/zip", fileName);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // check for updates (client endpoint)
    [Authorize(Roles = "client")]
    [HttpPost("check")]
    public async Task<IActionResult> CheckForUpdateAsync(CheckUpdateRequest request)
    {
      try
      {
        Response<CheckUpdateResponse> result = await _appUpdateService.CheckForUpdateResponseAsync(
          request
        );
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    // get latest update for an application (client endpoint)
    [Authorize(Roles = "client")]
    [HttpGet("latest/aplicacao/{aplicacaoId}")]
    public async Task<IActionResult> GetLatestUpdateAsync(Guid aplicacaoId)
    {
      try
      {
        Response<AppUpdateDTO> result = await _appUpdateService.GetLatestUpdateResponseAsync(
          aplicacaoId
        );
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
      }
    }

    #endregion [-- APPUPDATE - ROUTES --]

    #region [-- HELPER METHODS --]

    private static string CalculateFileHash(string filePath)
    {
      using (SHA256 sha256 = SHA256.Create())
      {
        using (System.IO.FileStream stream = System.IO.File.OpenRead(filePath))
        {
          byte[] hashBytes = sha256.ComputeHash(stream);
          return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }
      }
    }

    #endregion [-- HELPER METHODS --]
  }
}
