using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Frotas.API.WebApi.Controllers
{
  [Route("client/upload")]
  [ApiController]
  public class FileUploadController : ControllerBase
  {
    private readonly ILogger<FileUploadController> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _uploadPath;

    public FileUploadController(ILogger<FileUploadController> logger, IConfiguration configuration)
    {
      _logger = logger;
      _configuration = configuration;
      
      // Obter o caminho de upload da configuração ou usar um padrão
      _uploadPath = configuration.GetValue<string>("FileUpload:Path") ?? Path.Combine(Directory.GetCurrentDirectory(), "uploads", "documentos");
      
      // Criar o diretório se não existir
      if (!Directory.Exists(_uploadPath))
      {
        Directory.CreateDirectory(_uploadPath);
      }
    }

    [Authorize(Roles = "client")]
    [HttpPost]
    [RequestSizeLimit(10485760)] // 10 MB
    public async Task<IActionResult> UploadFiles([FromForm] IFormFileCollection files)
    {
      try
      {
        if (files == null || files.Count == 0)
        {
          return BadRequest(new { success = false, message = "Nenhum ficheiro foi enviado." });
        }

        var uploadedFiles = new List<object>();

        foreach (var file in files)
        {
          if (file.Length > 0)
          {
            // Gerar um nome único para o ficheiro
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadPath, uniqueFileName);

            // Guardar o ficheiro
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
              await file.CopyToAsync(stream);
            }

            // Caminho relativo para retornar ao cliente
            var relativePath = Path.Combine("uploads", "documentos", uniqueFileName);

            uploadedFiles.Add(new
            {
              nome = file.FileName,
              caminho = relativePath.Replace("\\", "/"), // Normalizar separadores de caminho
              tipo = file.ContentType,
              tamanho = file.Length
            });

            _logger.LogInformation($"Ficheiro carregado: {file.FileName} -> {relativePath}");
          }
        }

        return Ok(new
        {
          success = true,
          files = uploadedFiles
        });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Erro ao fazer upload de ficheiros");
        return StatusCode(500, new { success = false, message = "Erro ao fazer upload dos ficheiros.", error = ex.Message });
      }
    }

    [Authorize(Roles = "client")]
    [HttpDelete]
    public IActionResult DeleteFile([FromQuery] string caminho)
    {
      try
      {
        if (string.IsNullOrWhiteSpace(caminho))
        {
          return BadRequest(new { success = false, message = "Caminho do ficheiro não fornecido." });
        }

        // Normalizar o caminho
        caminho = caminho.Replace("/", "\\");
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), caminho);

        // Verificar se o ficheiro existe
        if (!System.IO.File.Exists(filePath))
        {
          return NotFound(new { success = false, message = "Ficheiro não encontrado." });
        }

        // Verificar se o ficheiro está dentro do diretório de uploads (segurança)
        var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!filePath.StartsWith(uploadDirectory, StringComparison.OrdinalIgnoreCase))
        {
          return BadRequest(new { success = false, message = "Caminho inválido." });
        }

        // Eliminar o ficheiro
        System.IO.File.Delete(filePath);

        _logger.LogInformation($"Ficheiro eliminado: {caminho}");

        return Ok(new { success = true, message = "Ficheiro eliminado com sucesso." });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, $"Erro ao eliminar ficheiro: {caminho}");
        return StatusCode(500, new { success = false, message = "Erro ao eliminar o ficheiro.", error = ex.Message });
      }
    }
  }
}

