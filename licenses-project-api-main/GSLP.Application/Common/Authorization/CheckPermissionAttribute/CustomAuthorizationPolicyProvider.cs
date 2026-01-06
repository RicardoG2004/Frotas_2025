using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace GSLP.Application.Common.Authorization.CheckPermissionAttribute
{
    public class CustomAuthorizationPolicyProvider : IAuthorizationPolicyProvider
    {
        private readonly DefaultAuthorizationPolicyProvider _fallbackPolicyProvider;

        public CustomAuthorizationPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            _fallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetPolicyAsync(string funcId)
        {
            Console.WriteLine($"Requested funcionalidade id: {funcId}");

            if (Guid.TryParse(funcId, out Guid funcionalidadeId))
            {
                Console.WriteLine($"Valid FuncId: {funcionalidadeId}, creating policy.");
                return Task.FromResult(
                    new AuthorizationPolicyBuilder()
                        .AddRequirements(new PermissionRequirement(funcionalidadeId))
                        .Build()
                );
            }
            else
            {
                // Log invalid FuncId
                Console.WriteLine($"Invalid funcionalidade id: {funcId}, creating a fail policy.");
                AuthorizationPolicyBuilder failPolicy = new();
                _ = failPolicy.RequireAssertion(context => false); // Always fail
                return Task.FromResult(failPolicy.Build());
            }
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
        {
            return _fallbackPolicyProvider.GetDefaultPolicyAsync();
        }

        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync()
        {
            return _fallbackPolicyProvider.GetFallbackPolicyAsync();
        }
    }
}
