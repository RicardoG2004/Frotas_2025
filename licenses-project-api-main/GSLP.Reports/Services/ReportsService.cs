using System.Globalization;
using GSLP.Application.Common.Wrapper;
using GSLP.Reports.Services.DTOs;

namespace GSLP.Reports.Services
{
  public class ReportsService : IReportsService
  {
    public async Task<(byte[] Content, string FileName)> GetReportJsonAsync(string mapa)
    {
      if (string.IsNullOrWhiteSpace(mapa))
        throw new ArgumentNullException(nameof(mapa));

      // Sanitize the filename to prevent directory traversal attacks
      mapa = Path.GetFileNameWithoutExtension(mapa);
      string fileName = $"{mapa}.mrt";

      string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", fileName);

      if (!File.Exists(filePath))
        throw new FileNotFoundException($"Template não encontrado: {fileName}", filePath);

      byte[] content = await File.ReadAllBytesAsync(filePath);
      return (content, fileName);
    }

    public async Task<Response<string>> SaveReportJsonAsync(SaveReportRequestDTO request)
    {
      try
      {
        // Validate the directory and create it if it doesn't exist
        string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates");
        if (!Directory.Exists(directoryPath))
        {
          _ = Directory.CreateDirectory(directoryPath);
        }

        // Prepare the file name and ensure it ends with .mrt
        string fileExtension = ".mrt"; // Ensure .mrt extension
        string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(request.Filename);
        string filepath = Path.Combine(directoryPath, fileNameWithoutExtension + fileExtension);

        // Check if the file already exists
        if (File.Exists(filepath))
        {
          string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture); // Timestamp for uniqueness
          string newFileName = $"{fileNameWithoutExtension}_{timestamp}{fileExtension}";

          // Rename the existing file before saving the new one
          string oldFilePath = filepath;
          string renamedFilePath = Path.Combine(directoryPath, newFileName);

          // Ensure the file is renamed properly before saving the new one
          File.Move(oldFilePath, renamedFilePath);
          filepath = oldFilePath; // Update the file path to the renamed one
        }

        // Convert the base64 content into byte array
        byte[] filedata = Convert.FromBase64String(request.Content);

        // Write the new file asynchronously
        await File.WriteAllBytesAsync(filepath, filedata);

        return Response<string>.Success("Relatório guardado com sucesso.");
      }
      catch (Exception ex)
      {
        return Response<string>.Fail(ex.Message);
      }
    }
  }
}
