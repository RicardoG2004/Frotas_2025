using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.ClienteService;
using GSLP.Application.Services.Platform.ClienteService.DTOs;
using GSLP.Application.Services.Platform.ClienteService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Platform
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _ClienteService;

        public ClientesController(IClienteService ClienteService)
        {
            _ClienteService = ClienteService;
        }

        #region [-- CLIENTE - ROUTES --]

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetClientesResponseAsync(string keyword = "")
        {
            Response<IEnumerable<ClienteDTO>> result =
                await _ClienteService.GetClientesResponseAsync(keyword);
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Clientes-paginated")]
        public async Task<IActionResult> GetClientesPaginatedResponseAsync(
            ClienteTableFilter filter
        )
        {
            PaginatedResponse<ClienteDTO> result =
                await _ClienteService.GetClientesPaginatedResponseAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClienteResponseAsync(Guid id)
        {
            Response<ClienteDTO> result = await _ClienteService.GetClienteResponseAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator")]
        [HttpPost]
        public async Task<IActionResult> CreateClienteResponseAsync(CreateClienteRequest request)
        {
            try
            {
                Response<Guid> result = await _ClienteService.CreateClienteResponseAsync(request);
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
        public async Task<IActionResult> UpdateClienteResponseAsync(
            UpdateClienteRequest request,
            Guid id
        )
        {
            try
            {
                Response<Guid> result = await _ClienteService.UpdateClienteResponseAsync(
                    request,
                    id
                );
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
        public async Task<IActionResult> DeleteClienteResponseAsync(Guid id)
        {
            try
            {
                Response<Guid> response = await _ClienteService.DeleteClienteResponseAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "root, administrator")]
        [HttpGet("by-licenca/{licencaId}")]
        public async Task<IActionResult> GetClienteByLicencaResponseAsync(Guid licencaId)
        {
            Response<ClienteDTO> result = await _ClienteService.GetClienteByLicencaResponseAsync(
                licencaId
            );
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeleteClientesAsync(
            [FromBody] DeleteClientesRequest request
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

                Response<List<Guid>> response = await _ClienteService.DeleteClientesAsync(
                    request.Ids
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        #endregion [-- CLIENTE - ROUTES --]
    }
}
