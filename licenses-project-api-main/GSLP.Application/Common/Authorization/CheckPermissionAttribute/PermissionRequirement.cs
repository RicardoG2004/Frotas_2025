using Microsoft.AspNetCore.Authorization;

namespace GSLP.Application.Common.Authorization.CheckPermissionAttribute
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public Guid FuncionalidadeId { get; }

        public PermissionRequirement(Guid funcionalidadeId)
        {
            FuncionalidadeId = funcionalidadeId;
        }
    }
}
