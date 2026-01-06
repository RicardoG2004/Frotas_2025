namespace GSLP.Application.Services.Application.AppUpdateService.DTOs
{
    public class AppUpdateStatisticsDTO
    {
        public int TotalUpdates { get; set; }
        public int ActiveUpdates { get; set; }
        public int MandatoryUpdates { get; set; }
        public string? LatestVersion { get; set; }
        public DateTime? LatestReleaseDate { get; set; }
        public long TotalFileSize { get; set; } // Total size of all update files in bytes
    }
}







