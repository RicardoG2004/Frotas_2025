using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.FuncionalidadeService;
using GSLP.Application.Services.Application.FuncionalidadeService.DTOs;
using GSLP.Application.Services.Application.FuncionalidadeService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Application
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionalidadesController : ControllerBase
    {
        private readonly IFuncionalidadeService _FuncionalidadeService;

        public FuncionalidadesController(IFuncionalidadeService FuncionalidadeService)
        {
            _FuncionalidadeService = FuncionalidadeService;
        }

        #region [-- FUNCIONALIDADE - ROUTES --]

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetFuncionalidadesResponseAsync(
            string keyword = "",
            Guid? moduloId = null
        )
        {
            Response<IEnumerable<FuncionalidadeDTO>> result =
                await _FuncionalidadeService.GetFuncionalidadesResponseAsync(keyword, moduloId);
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Funcionalidades-paginated")]
        public async Task<IActionResult> GetFuncionalidadesPaginatedResponseResponseAsync(
            FuncionalidadeTableFilter filter
        )
        {
            PaginatedResponse<FuncionalidadeDTO> result =
                await _FuncionalidadeService.GetFuncionalidadesPaginatedResponseAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFuncionalidadeResponseAsync(Guid id)
        {
            Response<FuncionalidadeDTO> result =
                await _FuncionalidadeService.GetFuncionalidadeResponseAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator")]
        [HttpPost]
        public async Task<IActionResult> CreateFuncionalidadeResponseAsync(
            CreateFuncionalidadeRequest request
        )
        {
            try
            {
                Response<Guid> result =
                    await _FuncionalidadeService.CreateFuncionalidadeResponseAsync(request);
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
        public async Task<IActionResult> UpdateFuncionalidadeResponseAsync(
            UpdateFuncionalidadeRequest request,
            Guid id
        )
        {
            try
            {
                Response<Guid> result =
                    await _FuncionalidadeService.UpdateFuncionalidadeResponseAsync(request, id);
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
        public async Task<IActionResult> DeleteFuncionalidadeResponseAsync(Guid id)
        {
            try
            {
                Response<Guid> response =
                    await _FuncionalidadeService.DeleteFuncionalidadeResponseAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // get funcionalidades by aplicacao
        [Authorize(Roles = "root, administrator")]
        [HttpGet("aplicacao/{aplicacaoId}")]
        public async Task<IActionResult> GetFuncionalidadesByAplicacaoResponseAsync(
            Guid aplicacaoId
        )
        {
            Response<IEnumerable<FuncionalidadeDTO>> result =
                await _FuncionalidadeService.GetFuncionalidadesByAplicacaoResponseAsync(
                    aplicacaoId
                );
            return Ok(result);
        }

        // get modulos by aplicacao
        [Authorize(Roles = "root, administrator")]
        [HttpGet("modulo/{moduloId}")]
        public async Task<IActionResult> GetFuncionalidadesByModuloResponseAsync(Guid moduloId)
        {
            Response<IEnumerable<FuncionalidadeDTO>> result =
                await _FuncionalidadeService.GetFuncionalidadesByModuloResponseAsync(moduloId);
            return Ok(result);
        }

        // bulk delete
        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeleteFuncionalidadesAsync(
            [FromBody] DeleteFuncionalidadesRequest request
        )
        {
            try
            {
                if (request?.Ids == null || request.Ids.Count == 0)
                {
                    return BadRequest(
                        Response<List<Guid>>.Fail("A lista de IDs não pode estar vazia")
                    );
                }

                Response<List<Guid>> response =
                    await _FuncionalidadeService.DeleteFuncionalidadesAsync(request.Ids);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        #endregion [-- FUNCIONALIDADE - ROUTES --]
    }
}
