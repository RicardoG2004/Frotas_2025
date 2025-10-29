using GSLP.Application.Common.Marker;

namespace GSLP.Reports.Services.DTOs
{
    public class SaveReportRequestDTO : IDto
    {
        public string Filename { get; set; }
        public string Content { get; set; }
    }
}
