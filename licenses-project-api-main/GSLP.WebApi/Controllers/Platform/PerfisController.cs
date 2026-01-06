using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.PerfilService;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.Filters;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers.Platform
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfisController : ControllerBase
    {
        private readonly IPerfilService _PerfilService;
        private readonly IPerfilFuncionalidadeService _PerfilFuncionalidadeService;
        private readonly IPerfilUtilizadorService _PerfilUtilizadorService;

        public PerfisController(
            IPerfilService PerfilService,
            IPerfilFuncionalidadeService PerfilFuncionalidadeService,
            IPerfilUtilizadorService PerfilUtilizadorService
        )
        {
            _PerfilService = PerfilService;
            _PerfilFuncionalidadeService = PerfilFuncionalidadeService;
            _PerfilUtilizadorService = PerfilUtilizadorService;
        }

        #region [-- PERFIL - ROUTES --]

        // full list
        [Authorize(Roles = "root, administrator")]
        [HttpGet]
        public async Task<IActionResult> GetPerfisResponseAsync(string keyword = "")
        {
            Response<IEnumerable<PerfilDTO>> result = await _PerfilService.GetPerfisResponseAsync(
                keyword
            );
            return Ok(result);
        }

        // paginated & filtered list
        [Authorize(Roles = "root, administrator")]
        [HttpPost("Perfis-paginated")]
        public async Task<IActionResult> GetPerfisPaginatedResponseAsync(PerfilTableFilter filter)
        {
            PaginatedResponse<PerfilDTO> result =
                await _PerfilService.GetPerfisPaginatedResponseAsync(filter);
            return Ok(result);
        }

        // single by Id
        [Authorize(Roles = "root, administrator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPerfilResponseAsync(Guid id)
        {
            Response<PerfilDTO> result = await _PerfilService.GetPerfilResponseAsync(id);
            return Ok(result);
        }

        // create
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePerfilResponseAsync(CreatePerfilRequest request)
        {
            try
            {
                Response<Guid> result = await _PerfilService.CreatePerfilResponseAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // update
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerfilResponseAsync(
            UpdatePerfilRequest request,
            Guid id
        )
        {
            try
            {
                Response<Guid> result = await _PerfilService.UpdatePerfilResponseAsync(request, id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // delete
        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerfilResponseAsync(Guid id)
        {
            try
            {
                Response<Guid> response = await _PerfilService.DeletePerfilResponseAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        #endregion [-- PERFIL - ROUTES --]

        #region [-- PERFILFUNCIONALIDADE - ROUTES --]

        // add funcionalidade to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("{perfilId}/funcionalidades/{funcionalidadeId}")]
        public async Task<IActionResult> AddFuncionalidadeToPerfilResponseAsync(
            Guid perfilId,
            Guid funcionalidadeId,
            PerfilFuncionalidadeOptionsAssociationRequest request
        )
        {
            Response<Guid> result =
                await _PerfilFuncionalidadeService.AddFuncionalidadeToPerfilResponseAsync(
                    perfilId,
                    funcionalidadeId,
                    request
                );
            return Ok(result);
        }

        // add multiple funcionalidades to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("{perfilId}/funcionalidades")]
        public async Task<IActionResult> AddFuncionalidadesToPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        )
        {
            Response<List<Guid>> result =
                await _PerfilFuncionalidadeService.AddFuncionalidadesToPerfilResponseAsync(
                    perfilId,
                    funcionalidades
                );
            return Ok(result);
        }

        // update multiple funcionalidades from perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPut("{perfilId}/funcionalidades")]
        public async Task<IActionResult> UpdateFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        )
        {
            Response<List<Guid>> result =
                await _PerfilFuncionalidadeService.UpdateFuncionalidadesFromPerfilResponseAsync(
                    perfilId,
                    funcionalidades
                );
            return Ok(result);
        }

        // remove multiple funcionalidades to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("{perfilId}/funcionalidades")]
        public async Task<IActionResult> RemoveFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<Guid> funcionalidadesIds
        )
        {
            Response<List<Guid>> result =
                await _PerfilFuncionalidadeService.RemoveFuncionalidadesFromPerfilResponseAsync(
                    perfilId,
                    funcionalidadesIds
                );
            return Ok(result);
        }

        // get perfil funcionalidades DTO by perfilId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("{perfilId}/funcionalidades")]
        public async Task<IActionResult> GetPerfilFuncionalidadesDTOByPerfilIdResponseAsync(
            Guid perfilId
        )
        {
            Response<IEnumerable<PerfilFuncionalidadeDTO>> result =
                await _PerfilFuncionalidadeService.GetPerfilFuncionalidadesDTOByPerfilIdResponseAsync(
                    perfilId
                );
            return Ok(result);
        }

        // get funcionalidades by perfilId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("{perfilId}/funcionalidades/tree")]
        public async Task<IActionResult> GetModulosFuncionalidadesTreeByPerfilIdIdResponseAsync(
            Guid perfilId
        )
        {
            Response<PerfilModulosFuncionalidadesTreeDTO> result =
                await _PerfilFuncionalidadeService.GetModulosFuncionalidadesTreeByPerfilIdResponseAsync(
                    perfilId
                );
            return Ok(result);
        }

        // get permissions by perfilId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("{perfilId}/permissions")]
        public async Task<IActionResult> GetPermissionsByPerfilIdResponseAsync(Guid perfilId)
        {
            Dictionary<string, int> result =
                await _PerfilFuncionalidadeService.GetPerfilPermissionsBitmaskByPerfilIdAsync(
                    perfilId
                );

            Response<Dictionary<string, int>> response = Response<Dictionary<string, int>>.Success(
                result
            );

            return Ok(response);
        }

        #endregion [-- PERFILFUNCIONALIDADE - ROUTES --]

        #region [-- PERFILUTILIZADOR - ROUTES --]

        // add utilizadores to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("{perfilId}/utilizadores/{utilizadorId}")]
        public async Task<IActionResult> AddUtilizadorToPerfilResponseAsync(
            Guid perfilId,
            string utilizadorId
        )
        {
            Response<Guid> result =
                await _PerfilUtilizadorService.AddUtilizadorToPerfilResponseAsync(
                    perfilId,
                    utilizadorId
                );
            return Ok(result);
        }

        // add multiple utilizadores to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("{perfilId}/utilizadores")]
        public async Task<IActionResult> AddUtilizadoresToPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadoresIds
        )
        {
            Response<List<Guid>> result =
                await _PerfilUtilizadorService.AddUtilizadoresToPerfilResponseAsync(
                    perfilId,
                    utilizadoresIds
                );
            return Ok(result);
        }

        // remove multiple utilizadores to perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("{perfilId}/utilizadores")]
        public async Task<IActionResult> RemoveUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadoresIds
        )
        {
            Response<List<Guid>> result =
                await _PerfilUtilizadorService.RemoveUtilizadoresFromPerfilResponseAsync(
                    perfilId,
                    utilizadoresIds
                );
            return Ok(result);
        }

        // update multiple utilizadores from perfil
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPut("{perfilId}/utilizadores")]
        public async Task<IActionResult> UpdateUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadoresIds
        )
        {
            Response<List<string>> result =
                await _PerfilUtilizadorService.UpdateUtilizadoresFromPerfilResponseAsync(
                    perfilId,
                    utilizadoresIds
                );
            return Ok(result);
        }

        // get utilizadores by perfilId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("{perfilId}/utilizadores")]
        public async Task<IActionResult> GetPerfilUtilizadoresByPerfilIdResponseAsync(
            Guid perfilId,
            [FromQuery] string? role = null
        )
        {
            Response<IEnumerable<UserDto>> result =
                await _PerfilUtilizadorService.GetUtilizadoresByPerfilIdResponseAsync(
                    perfilId,
                    role
                );
            return Ok(result);
        }

        #endregion [-- PERFILUTILIZADOR - ROUTES --]

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> DeletePerfisAsync([FromBody] DeletePerfisRequest request)
        {
            try
            {
                if (request?.Ids == null || request.Ids.Count == 0)
                {
                    return BadRequest(
                        Response<List<Guid>>.Fail("A lista de IDs não pode estar vazia")
                    );
                }

                Response<List<Guid>> response = await _PerfilService.DeletePerfisAsync(request.Ids);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // full list by licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("licenca/{licencaId}")]
        public async Task<IActionResult> GetPerfisFromLicencaResponseAsync(
            Guid licencaId,
            string keyword = ""
        )
        {
            Response<IEnumerable<PerfilBasicDTO>> result =
                await _PerfilService.GetPerfisFromLicencaResponseAsync(licencaId, keyword);
            return Ok(result);
        }

        // single by Id and licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("licenca/{licencaId}/perfil/{id}")]
        public async Task<IActionResult> GetPerfilByIdFromLicencaResponseAsync(
            Guid licencaId,
            Guid id
        )
        {
            Response<PerfilBasicDTO> result =
                await _PerfilService.GetPerfilByIdFromLicencaResponseAsync(licencaId, id);
            return Ok(result);
        }

        // create with licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("licenca/{licencaId}/create")]
        public async Task<IActionResult> CreatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            CreatePerfilBasicRequest request
        )
        {
            try
            {
                Response<Guid> result = await _PerfilService.CreatePerfilFromLicencaResponseAsync(
                    licencaId,
                    request
                );
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // update with licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPut("licenca/{licencaId}/perfil/{id}")]
        public async Task<IActionResult> UpdatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            Guid id,
            UpdatePerfilRequest request
        )
        {
            try
            {
                Response<Guid> result = await _PerfilService.UpdatePerfilFromLicencaResponseAsync(
                    licencaId,
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

        // delete with licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("licenca/{licencaId}/perfil/{id}")]
        public async Task<IActionResult> DeletePerfilFromLicencaResponseAsync(
            Guid licencaId,
            Guid id
        )
        {
            try
            {
                Response<Guid> result = await _PerfilService.DeletePerfilFromLicencaResponseAsync(
                    licencaId,
                    id
                );
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        // paginated list with licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("licenca/{licencaId}/perfis-paginated")]
        public async Task<IActionResult> GetPerfisFromLicencaPaginatedResponseAsync(
            Guid licencaId,
            PerfilTableFilter filter
        )
        {
            PaginatedResponse<PerfilBasicDTO> result =
                await _PerfilService.GetPerfisFromLicencaPaginatedResponseAsync(licencaId, filter);
            return Ok(result);
        }

        // bulk delete with licencaId
        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("licenca/{licencaId}/bulk-delete")]
        public async Task<IActionResult> DeletePerfisFromLicencaResponseAsync(
            Guid licencaId,
            [FromBody] DeletePerfisRequest request
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
                    await _PerfilService.DeletePerfisFromLicencaResponseAsync(
                        licencaId,
                        request.Ids
                    );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }
    }
}
