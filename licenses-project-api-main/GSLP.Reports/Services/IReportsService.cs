using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Reports.Services.DTOs;

namespace GSLP.Reports.Services
{
    public interface IReportsService : ITransientService
    {
        Task<(byte[] Content, string FileName)> GetReportJsonAsync(string mapa);
        Task<Response<string>> SaveReportJsonAsync(SaveReportRequestDTO request);
    }
}
