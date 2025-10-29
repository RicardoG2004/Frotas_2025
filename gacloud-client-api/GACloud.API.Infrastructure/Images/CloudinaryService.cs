using CloudinaryDotNet; // cloudinary sdk
using CloudinaryDotNet.Actions; // cloudinary sdk
using GACloud.API.Application.Common.Images;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

// Cloudinary is a 3rd party platform for digital asset management.
// -- images (and files) are stored on the platform and retrieved via public CDN
// -- this is an implementation of their service using the CloudinaryDotNet SDK
// -- create a free account and change the api keys in appsettings.json

namespace GACloud.API.Infrastructure.Images
{
  public class CloudinaryService : IImageService
  {
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IOptions<CloudinarySettings> config)
    {
      Account account = new(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
      _cloudinary = new Cloudinary(account);
    }

    public async Task<string> AddImage(IFormFile file, int height, int width)
    {
      if (file.Length > 0)
      {
        await using Stream stream = file.OpenReadStream();
        ImageUploadParams uploadParams = new()
        {
          File = new FileDescription(file.FileName, stream),
          Transformation = new Transformation()
            .Height(height)
            .Width(width)
            .Crop("fill")
            .Gravity("auto"),
        };

        ImageUploadResult uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
          throw new Exception(uploadResult.Error.Message);
        }

        return uploadResult.SecureUrl.ToString();
      }

      return null;
    }

    public async Task<string> DeleteImage(string url)
    {
      string urlSegment = new Uri(url).Segments.Last();
      string publicId = Path.GetFileNameWithoutExtension(urlSegment);

      DeletionParams deleteParams = new(publicId);
      DeletionResult result = await _cloudinary.DestroyAsync(deleteParams);
      return result.Result == "ok" ? result.Result : null;
    }
  }
}
