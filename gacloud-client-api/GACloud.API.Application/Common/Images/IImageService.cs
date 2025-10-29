using GACloud.API.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace GACloud.API.Application.Common.Images
{
  public interface IImageService : ITransientService
  {
    Task<string> AddImage(IFormFile file, int height, int width);
    Task<string> DeleteImage(string url);
  }
}
