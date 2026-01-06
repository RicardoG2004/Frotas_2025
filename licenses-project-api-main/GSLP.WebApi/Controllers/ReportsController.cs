using GSLP.Application.Common.Wrapper;
using GSLP.Reports.Services;
using GSLP.Reports.Services.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("json")]
        public async Task<IActionResult> GetReportJsonAsync([FromQuery] string mapa)
        {
            (byte[] content, string fileName) = await _reportsService.GetReportJsonAsync(mapa);

            System.Net.Mime.ContentDisposition cd = new() { FileName = fileName, Inline = false };
            Response.Headers.Append("Content-Disposition", cd.ToString());

            return File(content, "application/json");
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("json")]
        public async Task<IActionResult> SaveReportJsonAsync(
            [FromBody] SaveReportRequestDTO request
        )
        {
            // Call the service method to save the report
            Response<string> response = await _reportsService.SaveReportJsonAsync(request);

            // Return success response
            return Ok(response);
        }
    }
}
