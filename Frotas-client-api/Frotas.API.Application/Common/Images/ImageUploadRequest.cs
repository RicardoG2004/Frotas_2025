using Frotas.API.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace Frotas.API.Application.Common.Images
{
  public class ImageUploadRequest : IDto
  {
    public IFormFile ImageFile { get; set; }
    public bool DeleteCurrentImage { get; set; }
  }
}
