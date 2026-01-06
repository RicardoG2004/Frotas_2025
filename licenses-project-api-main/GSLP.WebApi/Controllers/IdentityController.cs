using GSLP.Application.Common.Identity;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Identity.Filters;
using GSLP.Application.Common.Images;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase // identity API controller
    {
        private readonly IIdentityService _identityService;
        private readonly IPerfilFuncionalidadeService _perfilFuncionalidadeService;

        public IdentityController(
            IIdentityService identityService,
            IPerfilFuncionalidadeService perfilFuncionalidadeService
        )
        {
            _identityService = identityService; // inject identity service
            _perfilFuncionalidadeService = perfilFuncionalidadeService;
        }

        // USER MANAGEMENT (admin-level permissions)
        #region [user management]

        [Authorize(Roles = "root, administrator")]
        [HttpGet("users")] // get user list
        public async Task<IActionResult> GetUsersResponseAsync(Guid? clienteId)
        {
            Response<IEnumerable<UserDto>> result = await _identityService.GetUsersResponseAsync(
                clienteId
            );
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpGet("users/{id}")] // get user details
        public async Task<IActionResult> GetUserDetailsResponseAsync(Guid id)
        {
            Response<UserDto> result = await _identityService.GetUserDetailsResponseAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpPost("users")] // register new user
        public async Task<IActionResult> RegisterUserResponseAsync(RegisterUserRequest request)
        {
            Response<UserDto> result = await _identityService.RegisterUserResponseAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpPut("users/{id}")] // update user
        public async Task<IActionResult> UpdateUserResponseAsync(UpdateUserRequest request, Guid id)
        {
            Response<UserDto> result = await _identityService.UpdateUserResponseAsync(request, id);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("users/{id}")] // delete user (soft-delete)
        public async Task<IActionResult> DeleteUserResponseAsync(Guid id)
        {
            Response<Guid> userId = await _identityService.DeleteUserResponseAsync(id);
            return Ok(userId);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpPost("users/users-paginated")]
        public async Task<IActionResult> GetUsersPaginatedResponseAsync(UserTableFilter filter)
        {
            PaginatedResponse<UserDto> result =
                await _identityService.GetUsersPaginatedResponseAsync(filter);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator")]
        [HttpDelete("users")]
        public async Task<IActionResult> DeleteUsersResponseAsync([FromBody] List<Guid> ids)
        {
            Response<List<Guid>> result = await _identityService.DeleteUsersResponseAsync(ids);
            return Ok(result);
        }

        #endregion [user management]

        // PROFILE (basic-level permissions)
        #region [profile]

        [Authorize(Roles = "root, administrator, admin, client")]
        [HttpGet("profile")] // get profile
        public async Task<IActionResult> GetProfileDetailsResponseAsync()
        {
            Response<UserDto> result = await _identityService.GetProfileDetailsResponseAsync();
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin, client")]
        [HttpPut("profile")] // update profile
        public async Task<IActionResult> UpdateProfileResponseAsync(UpdateProfileRequest request)
        {
            Response<UserDto> result = await _identityService.UpdateProfileResponseAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin, client")]
        [HttpPut("profile-image")] // update profile image
        public async Task<IActionResult> UpdateProfileImageResponseAsync(
            [FromForm] ImageUploadRequest request
        )
        {
            Response<string> result = await _identityService.ChangeProfileImageResponseAsync(
                request
            );
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin, client")]
        [HttpPut("change-password")] // update password
        public async Task<IActionResult> ChangePasswordResponseAsync(ChangePasswordRequest request)
        {
            Response<string> result = await _identityService.ChangePasswordResponseAsync(request);
            return Ok(result);
        }

        #endregion [profile]

        // FORGOT/RESET PASSWORD (anonymous permissions -- tenant ID from header or subdomain)
        #region [forgot/reset password]

        [AllowAnonymous]
        [HttpPost("forgot-password")] // forgot password
        public async Task<IActionResult> ForgotPasswordResponseAsync(ForgotPasswordRequest request)
        {
            string origin = GenerateOrigin();
            string route = "ResetPassword";
            Response<string> result = await _identityService.ForgotPasswordResponseAsync(
                request,
                origin,
                route
            ); // origin and route used to construct reset link in email message
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("reset-password")] // reset password
        public async Task<IActionResult> ResetPasswordResponseAsync(ResetPasswordRequest request)
        {
            Response<string> result = await _identityService.ResetPasswordResponseAsync(request);
            return Ok(result);
        }

        private string GenerateOrigin() // helper method to return origin URL
        {
            string baseUrl = $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}";
            string origin = string.IsNullOrEmpty(Request.Headers["origin"].ToString())
                ? baseUrl
                : Request.Headers["origin"].ToString();
            return origin;
        }

        #endregion [forgot/reset password]

        #region [admin-level]

        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("users/create")] // register new user of role type admin or client
        public async Task<IActionResult> RegisterAdminOrClientRoleUserResponseAsync(
            RegisterAdminOrClientUserRequest request
        )
        {
            Response<UserDto> result =
                await _identityService.RegisterAdminOrClientRoleUserResponseAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpPut("users/{id}/update")] // update new user of role type admin or client
        public async Task<IActionResult> UpdateAdminOrClientRoleUserResponseAsync(
            Guid id,
            UpdateAdminOrClientUserRequest request
        )
        {
            Response<UserDto> result =
                await _identityService.UpdateAdminOrClientRoleUserResponseAsync(id, request);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("clientes/{clienteId}/users/list")] // get cliente user list
        public async Task<IActionResult> GetAdminOrClienteRoleUsersResponseAsync(
            Guid clienteId,
            string? role
        )
        {
            Response<IEnumerable<UserDto>> result =
                await _identityService.GetUsersByClienteAndRoleResponseAsync(clienteId, role);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("users/{id}/delete")] // delete user of role type admin or client
        public async Task<IActionResult> DeleteAdminOrClienteRoleUsersResponseAsync(Guid id)
        {
            Response<Guid> userId = await _identityService.DeleteAdminOrClientRoleUserResponseAsync(
                id
            );
            return Ok(userId);
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpDelete("users/bulk-delete")]
        public async Task<IActionResult> DeleteAdminOrClientRoleUsersAsync(
            [FromBody] DeleteUsersRequest request
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
                    await _identityService.DeleteAdminOrClientRoleUsersResponseAsync(request.Ids);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(GSLP.Application.Common.Wrapper.Response.Fail(ex.Message));
            }
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpGet("users/{id}/get")] // get basic user details
        public async Task<IActionResult> GetBasicUserDetailsResponseAsync(Guid id)
        {
            Response<UserDto> result = await _identityService.GetBasicUserDetailsResponseAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "root, administrator, admin")]
        [HttpPost("clientes/{clienteId}/users/users-paginated")] // get paginated cliente user list
        public async Task<IActionResult> GetAdminOrClienteRoleUsersPaginatedResponseAsync(
            Guid clienteId,
            UserTableFilter filter
        )
        {
            PaginatedResponse<UserDto> result =
                await _identityService.GetUsersByClienteAndRolePaginatedResponseAsync(
                    clienteId,
                    filter
                );
            return Ok(result);
        }

        #endregion [admin-level]

        #region [client-level]

        // get permissions by utilizadorId
        [Authorize(Roles = "root, administrator, admin, client")]
        [HttpGet("users/{utilizadorId}/permissions")]
        public async Task<IActionResult> GetPermissionsByUtilizadorIdResponseAsync(
            string utilizadorId
        )
        {
            Dictionary<string, int> result =
                await _perfilFuncionalidadeService.GetPerfilPermissionsBitmaskByUtilizadorIdAsync(
                    utilizadorId
                );

            Response<Dictionary<string, int>> response = Response<Dictionary<string, int>>.Success(
                result
            );

            return Ok(response);
        }

        #endregion [client-level]
    }
}
