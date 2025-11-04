using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.EquipamentoService;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frotas.API.WebApi.Controllers.Frotas
{
    [Route("client/frotas/equipamentos")]
    [ApiController]
    public class EquipamentosController (IEquipamentoService EquipamentoService) : ControllerBase
    {
        private readonly IEquipamentoService _EquipamentoService = EquipamentoService;

        // full list
        [Authorize(Roles = "client")]
        [HttpGet]
        public async Task<IActionResult> GetEquipamentosAsync(string keyword = "")
        {
            Response<IEnumerable<EquipamentoDTO>> result = await _EquipamentoService.GetEquipamentosAsync(keyword);
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "client")]
        [HttpPost("paginated")]
        public async Task<IActionResult> GetEquipamentosPaginatedAsync(EquipamentoTableFilter filter)
        {
                PaginatedResponse<EquipamentoDTO> result = await _EquipamentoService.GetEquipamentosPaginatedAsync(filter);
                return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "client")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipamentoAsync(Guid id)
        {
            Response<EquipamentoDTO> result = await _EquipamentoService.GetEquipamentoAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "client")]
        [HttpPost]
        public async Task<IActionResult> CreateEquipamentoAsync(CreateEquipamentoRequest request)
        {
            try
            {
                Response<Guid> result = await _EquipamentoService.CreateEquipamentoAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // update
        [Authorize(Roles = "client")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipamentoAsync(UpdateEquipamentoRequest request, Guid id)
        {
            try
            {
                Response<Guid> result = await _EquipamentoService.UpdateEquipamentoAsync(request, id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // delete
        [Authorize(Roles = "client")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipamentoAsync(Guid id)
        {
            try
            {
                Response<Guid> result = await _EquipamentoService.DeleteEquipamentoAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // delete multiple
        [Authorize(Roles = "client")]
        [HttpDelete("bulk")]
        public async Task<IActionResult> DeleteMultipleEquipamentosAsync([FromBody] DeleteMultipleEquipamentoRequest request)
        {
            try
            {
                Response<IEnumerable<Guid>> result = await _EquipamentoService.DeleteMultipleEquipamentosAsync(request.Ids);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}