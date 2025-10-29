using Microsoft.AspNetCore.Authorization;

namespace GSLP.Application.Common.Authorization.CheckPermissionAttribute
{
    public class CheckPermissionAttribute : AuthorizeAttribute
    {
        public Guid FuncionalidadeId { get; }

        public CheckPermissionAttribute(string funcionalidadeId)
        {
            // Try parsing the provided string to a Guid
            if (!Guid.TryParse(funcionalidadeId, out Guid guid))
            {
                // Throw a more descriptive exception
                throw new ArgumentException(
                    $"Formato inválido da FuncionalidadeId: '{funcionalidadeId}' não é uma GUID válida.",
                    nameof(funcionalidadeId)
                );
            }

            FuncionalidadeId = guid;
            // Use only the FuncionalidadeId as the policy name
            Policy = funcionalidadeId; // Directly assign the Guid (as string)
        }
    }
}
