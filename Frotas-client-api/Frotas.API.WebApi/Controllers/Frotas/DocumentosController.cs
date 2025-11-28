using Frotas.API.Application.Common.Wrapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ResponseWrapper = global::Frotas.API.Application.Common.Wrapper.Response;

namespace Frotas.API.WebApi.Controllers.Frotas
{
  [Route("client/frotas/documentos")]
  [ApiController]
  public class DocumentosController : ControllerBase
  {
    private readonly IWebHostEnvironment _environment;
    private const string UPLOAD_BASE_PATH_SEGUROS = "uploads/seguros";
    private const string UPLOAD_BASE_PATH_VIATURAS = "uploads/viaturas";

    public DocumentosController(IWebHostEnvironment environment)
    {
      _environment = environment;
    }

    [Authorize(Roles = "client")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocumento(
      [FromForm] IFormFile file,
      [FromForm] string? seguroId = null,
      [FromForm] string? viaturaId = null,
      [FromForm] string? pasta = null
    )
    {
      try
      {
        if (file == null || file.Length == 0)
        {
          return BadRequest(ResponseWrapper.Fail("Ficheiro não fornecido"));
        }

        // Validar que apenas um ID é fornecido
        var idsCount = (string.IsNullOrEmpty(seguroId) ? 0 : 1) + (string.IsNullOrEmpty(viaturaId) ? 0 : 1);
        if (idsCount > 1)
        {
          return BadRequest(ResponseWrapper.Fail("Apenas um ID pode ser fornecido (seguroId ou viaturaId)"));
        }

        // Determinar o caminho base e o ID
        string uploadBasePath;
        string? entityId = null;
        
        if (!string.IsNullOrEmpty(seguroId))
        {
          uploadBasePath = UPLOAD_BASE_PATH_SEGUROS;
          entityId = seguroId;
        }
        else if (!string.IsNullOrEmpty(viaturaId))
        {
          uploadBasePath = UPLOAD_BASE_PATH_VIATURAS;
          entityId = viaturaId;
        }
        else
        {
          // Por padrão, usar seguros se nenhum ID for fornecido (compatibilidade)
          uploadBasePath = UPLOAD_BASE_PATH_SEGUROS;
        }

        // Validar tamanho do ficheiro (máximo 10MB)
        if (file.Length > 10 * 1024 * 1024)
        {
          return BadRequest(ResponseWrapper.Fail("Ficheiro muito grande. Tamanho máximo: 10MB"));
        }

        // Sanitizar nome do ficheiro
        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
        var fileExtension = Path.GetExtension(file.FileName);
        var sanitizedFileName = $"{SanitizeFileName(fileName)}{fileExtension}";
        
        // Criar caminho baseado na estrutura de pastas
        var wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var basePath = Path.Combine(wwwrootPath, uploadBasePath);
        
        // Se houver entityId, incluir na estrutura de pastas
        if (!string.IsNullOrEmpty(entityId) && Guid.TryParse(entityId, out var entityGuid))
        {
          basePath = Path.Combine(basePath, entityGuid.ToString());
        }
        
        // Se houver pasta definida pelo utilizador, incluir na estrutura
        if (!string.IsNullOrWhiteSpace(pasta))
        {
          var sanitizedPasta = SanitizeFileName(pasta);
          basePath = Path.Combine(basePath, sanitizedPasta);
        }

        // Garantir que a pasta existe
        Directory.CreateDirectory(basePath);

        // Se já existir um ficheiro com o mesmo nome, adicionar timestamp
        var filePath = Path.Combine(basePath, sanitizedFileName);
        if (System.IO.File.Exists(filePath))
        {
          var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
          var fileNameWithoutExt = Path.GetFileNameWithoutExtension(sanitizedFileName);
          sanitizedFileName = $"{fileNameWithoutExt}_{timestamp}{fileExtension}";
          filePath = Path.Combine(basePath, sanitizedFileName);
        }

        // Guardar o ficheiro
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
          await file.CopyToAsync(stream);
        }

        // Criar caminho relativo para guardar na base de dados (relativo a wwwroot)
        var relativePathParts = new List<string> { uploadBasePath };
        
        if (!string.IsNullOrEmpty(entityId) && Guid.TryParse(entityId, out _))
        {
          relativePathParts.Add(entityId);
        }
        
        if (!string.IsNullOrWhiteSpace(pasta))
        {
          relativePathParts.Add(SanitizeFileName(pasta));
        }
        
        relativePathParts.Add(sanitizedFileName);
        
        var relativePath = string.Join("/", relativePathParts);

        var response = global::Frotas.API.Application.Common.Wrapper.Response<string>.Success(relativePath);
        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(global::Frotas.API.Application.Common.Wrapper.Response<string>.Fail($"Erro ao fazer upload: {ex.Message}"));
      }
    }

    [Authorize(Roles = "client")]
    [HttpGet("download/{*filePath}")]
    public IActionResult DownloadDocumento(string filePath)
    {
      try
      {
        // Sanitizar o caminho para evitar directory traversal
        filePath = filePath.Replace("..", "").Replace("\\", "/");
        var wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var fullPath = Path.Combine(wwwrootPath, filePath);

        // Verificar se o ficheiro existe e está dentro do diretório permitido
        var baseUploadPathSeguros = Path.Combine(wwwrootPath, UPLOAD_BASE_PATH_SEGUROS);
        var baseUploadPathViaturas = Path.Combine(wwwrootPath, UPLOAD_BASE_PATH_VIATURAS);
        var isInSegurosPath = fullPath.StartsWith(baseUploadPathSeguros, StringComparison.OrdinalIgnoreCase);
        var isInViaturasPath = fullPath.StartsWith(baseUploadPathViaturas, StringComparison.OrdinalIgnoreCase);
        if ((!isInSegurosPath && !isInViaturasPath) || !System.IO.File.Exists(fullPath))
        {
          return NotFound(ResponseWrapper.Fail("Ficheiro não encontrado"));
        }

        var fileBytes = System.IO.File.ReadAllBytes(fullPath);
        var fileName = Path.GetFileName(fullPath);
        var contentType = GetContentType(fileName);

        return File(fileBytes, contentType, fileName);
      }
      catch (Exception ex)
      {
        return BadRequest(ResponseWrapper.Fail($"Erro ao descarregar ficheiro: {ex.Message}"));
      }
    }

    [Authorize(Roles = "client")]
    [HttpDelete("{*filePath}")]
    public IActionResult DeleteDocumento(string filePath)
    {
      try
      {
        // Sanitizar o caminho para evitar directory traversal
        filePath = filePath.Replace("..", "").Replace("\\", "/");
        var wwwrootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var fullPath = Path.Combine(wwwrootPath, filePath);

        // Verificar se o ficheiro existe e está dentro do diretório permitido
        var baseUploadPathSeguros = Path.Combine(wwwrootPath, UPLOAD_BASE_PATH_SEGUROS);
        var baseUploadPathViaturas = Path.Combine(wwwrootPath, UPLOAD_BASE_PATH_VIATURAS);
        var isInSegurosPath = fullPath.StartsWith(baseUploadPathSeguros, StringComparison.OrdinalIgnoreCase);
        var isInViaturasPath = fullPath.StartsWith(baseUploadPathViaturas, StringComparison.OrdinalIgnoreCase);
        if ((!isInSegurosPath && !isInViaturasPath) || !System.IO.File.Exists(fullPath))
        {
          return NotFound(ResponseWrapper.Fail("Ficheiro não encontrado"));
        }

        System.IO.File.Delete(fullPath);

        return Ok(ResponseWrapper.Success());
      }
      catch (Exception ex)
      {
        return BadRequest(ResponseWrapper.Fail($"Erro ao eliminar ficheiro: {ex.Message}"));
      }
    }

    private static string SanitizeFileName(string fileName)
    {
      if (string.IsNullOrWhiteSpace(fileName))
        return "file";

      // Remover caracteres inválidos
      var invalidChars = Path.GetInvalidFileNameChars();
      var sanitized = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
      
      // Limitar tamanho
      if (sanitized.Length > 100)
      {
        sanitized = sanitized.Substring(0, 100);
      }

      return sanitized;
    }

    private static string GetContentType(string fileName)
    {
      var extension = Path.GetExtension(fileName).ToLowerInvariant();
      return extension switch
      {
        ".pdf" => "application/pdf",
        ".jpg" => "image/jpeg",
        ".jpeg" => "image/jpeg",
        ".png" => "image/png",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        ".doc" => "application/msword",
        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls" => "application/vnd.ms-excel",
        ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        _ => "application/octet-stream"
      };
    }
  }
}

