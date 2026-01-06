using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.ModuloService;
using GSLP.Application.Services.Application.ModuloService.DTOs;
using GSLP.Application.Services.Application.ModuloService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Application
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModulosController : ControllerBase
    {
        private readonly IModuloService _ModuloService;

        public ModulosController(IModuloService ModuloService)
        {
            _ModuloService = ModuloService;
        }

        #region [-- MODULO - ROUTES --]

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetModulosResponseAsync(
            string keyword = "",
            Guid? aplicacaoId = null
        )
        {
            Response<IEnumerable<ModuloDTO>> result = await _ModuloService.GetModulosResponseAsync(
                keyword,
                aplicacaoId
            );
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Modulos-paginated")]
        public async Task<IActionResult> GetModulosPaginatedResponseAsync(ModuloTableFilter filter)
        {
            PaginatedResponse<ModuloDTO> result =
                await _ModuloService.GetModulosPaginatedResponseAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetModuloResponseAsync(Guid id)
        {
            Response<ModuloDTO> result = await _ModuloService.GetModuloResponseAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator")]
        [HttpPost]
        public async Task<IActionResult> CreateModuloResponseAsync(CreateModuloRequest request)
        {
            try
            {
                Response<Guid> result = await _ModuloService.CreateModuloResponseAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // update
        [Authorize(Roles = "root, administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateModuloResponseAsync(
            UpdateModuloRequest request,
            Guid id
        )
        {
            try
            {
                Response<Guid> result = await _ModuloService.UpdateModuloResponseAsync(request, id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // delete
        [Authorize(Roles = "root, administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModuloResponseAsync(Guid id)
        {
            try
            {
                Response<Guid> response = await _ModuloService.DeleteModuloResponseAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeleteModulosAsync([FromBody] DeleteModulosRequest request)
        {
            try
            {
                if (request?.Ids == null || request.Ids.Count == 0)
                {
                    return BadRequest(
                        Response<List<Guid>>.Fail("A lista de IDs não pode estar vazia")
                    );
                }

                Response<List<Guid>> response = await _ModuloService.DeleteModulosAsync(
                    request.Ids
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        #endregion [-- MODULO - ROUTES --]
    }
}
