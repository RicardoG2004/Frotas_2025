using GSLP.Application.Common.Marker;
using GSLP.Application.Services.Platform.LicencaService;
using GSLP.Application.Services.Platform.PerfilService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace GSLP.Application.Common.Authorization.CheckPermissionAttribute
{
    public class PermissionRequirementHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IPerfilService _perfilService;
        private readonly ILicencaService _licencaService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PermissionRequirementHandler(
            IPerfilService perfilService,
            ILicencaService licencaService,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _perfilService = perfilService;
            _licencaService = licencaService;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement
        )
        {
            // Attempt to retrieve the API key from request headers
            if (!TryGetApiKey(_httpContextAccessor.HttpContext.Request.Headers, out string APIKey))
            {
                context.Fail(); // Fail if API Key is missing
                return;
            }

            // Get the user ID from the claims
            string? userId = context.User?.FindFirst("uid")?.Value;
            if (userId == null)
            {
                context.Fail(); // Fail if User ID is missing
                return;
            }

            // Fetch the Licenca using the API Key
            Services.Platform.LicencaService.DTOs.LicencaDTO? licenca =
                await _licencaService.GetLicencaByAPIKeyAsync(APIKey);
            if (licenca == null)
            {
                context.Fail(); // Fail if Licenca is not found
                return;
            }

            // Retrieve the Perfil associated with the given UserId and LicencaId
            Domain.Entities.Catalog.Platform.Perfil? perfil =
                await _perfilService.GetPerfilByUtilizadorIdAndLicenseIdAsync(
                    userId,
                    Guid.Parse(licenca.Id!)
                );
            if (perfil == null)
            {
                context.Fail(); // Fail if Perfil is not found
                return;
            }

            // Check if the Perfil has the required Funcionalidade
            bool hasFuncionalidade = perfil.PerfisFuncionalidades.Any(pf =>
                pf.FuncionalidadeId == requirement.FuncionalidadeId
            ); // Match FuncionalidadeId with the requirement

            if (hasFuncionalidade)
            {
                context.Succeed(requirement); // User has the required permission
            }
            else
            {
                context.Fail(); // User does not have the required permission
            }
        }

        private static bool TryGetApiKey(IHeaderDictionary headers, out string APIKey)
        {
            if (
                headers.TryGetValue("X-API-Key", out var APIKeyValues)
                && !string.IsNullOrEmpty(APIKeyValues)
            )
            {
                APIKey = APIKeyValues.First();
                return true;
            }
            APIKey = null;
            return false;
        }
    }
}
