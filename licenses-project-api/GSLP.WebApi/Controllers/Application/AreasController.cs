using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AreaService;
using GSLP.Application.Services.Application.AreaService.DTOs;
using GSLP.Application.Services.Application.AreaService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Application
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly IAreaService _AreaService;

        public AreasController(IAreaService AreaService)
        {
            _AreaService = AreaService;
        }

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetAreasAsync(string keyword = "")
        {
            Response<IEnumerable<AreaDTO>> result = await _AreaService.GetAreasAsync(keyword);
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Areas-paginated")]
        public async Task<IActionResult> GetAreasPaginatedAsync(AreaTableFilter filter)
        {
            PaginatedResponse<AreaDTO> result = await _AreaService.GetAreasPaginatedAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAreaAsync(Guid id)
        {
            Response<AreaDTO> result = await _AreaService.GetAreaAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator")]
        [HttpPost]
        public async Task<IActionResult> CreateAreaAsync(CreateAreaRequest request)
        {
            try
            {
                Response<Guid> result = await _AreaService.CreateAreaAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // update
        [Authorize(Roles = "root, administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAreaAsync(UpdateAreaRequest request, Guid id)
        {
            try
            {
                Response<Guid> result = await _AreaService.UpdateAreaAsync(request, id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // delete
        [Authorize(Roles = "root, administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAreaAsync(Guid id)
        {
            try
            {
                Response<Guid> response = await _AreaService.DeleteAreaAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeleteAreasAsync([FromBody] DeleteAreasRequest request)
        {
            try
            {
                if (request?.Ids == null || request.Ids.Count == 0)
                {
                    return BadRequest(
                        Response<List<Guid>>.Fail("A lista de IDs não pode estar vazia")
                    );
                }

                Response<List<Guid>> response = await _AreaService.DeleteAreasAsync(request.Ids);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
