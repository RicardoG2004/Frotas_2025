using GSLP.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace GSLP.Application.Common.Images
{
    public class ImageUploadRequest : IDto
    {
        public IFormFile ImageFile { get; set; }
        public bool DeleteCurrentImage { get; set; }
    }
}
