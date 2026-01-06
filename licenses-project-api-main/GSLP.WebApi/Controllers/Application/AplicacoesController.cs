using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AplicacaoService;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Application.AplicacaoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Application
{
    [Route("api/[controller]")]
    [ApiController]
    public class AplicacoesController : ControllerBase
    {
        private readonly IAplicacaoService _AplicacaoService;

        public AplicacoesController(IAplicacaoService AplicacaoService)
        {
            _AplicacaoService = AplicacaoService;
        }

        #region [-- APLICACAO - ROUTES --]

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetAplicacoesAsync(string keyword = "")
        {
            Response<IEnumerable<AplicacaoDTO>> result =
                await _AplicacaoService.GetAplicacoesResponseAsync(keyword);
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Aplicacoes-paginated")]
        public async Task<IActionResult> GetAplicacoesPaginatedResponseAsync(
            AplicacaoTableFilter filter
        )
        {
            PaginatedResponse<AplicacaoDTO> result =
                await _AplicacaoService.GetAplicacoesPaginatedResponseAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAplicacaoAsync(Guid id)
        {
            Response<AplicacaoDTO> result = await _AplicacaoService.GetAplicacaoResponseAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator")]
        [HttpPost]
        public async Task<IActionResult> CreateAplicacaoAsync(CreateAplicacaoRequest request)
        {
            try
            {
                Response<Guid> result = await _AplicacaoService.CreateAplicacaoResponseAsync(
                    request
                );
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // update
        [Authorize(Roles = "root , administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAplicacaoAsync(
            UpdateAplicacaoRequest request,
            Guid id
        )
        {
            try
            {
                Response<Guid> result = await _AplicacaoService.UpdateAplicacaoResponseAsync(
                    request,
                    id
                );
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
        public async Task<IActionResult> DeleteAplicacaoAsync(Guid id)
        {
            try
            {
                Response<Guid> response = await _AplicacaoService.DeleteAplicacaoResponseAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeleteAplicacoesAsync(
            [FromBody] DeleteAplicacoesRequest request
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

                Response<List<Guid>> response = await _AplicacaoService.DeleteAplicacoesAsync(
                    request.Ids
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion [-- APLICACAO - ROUTES --]
    }
}
