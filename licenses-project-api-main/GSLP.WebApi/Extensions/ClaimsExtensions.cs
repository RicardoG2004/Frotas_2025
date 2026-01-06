using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GSLP.WebApi.Extensions
{
    public static class ClaimsExtensions
    {
        // Get the username claim (use "nameidentifier" as it corresponds to the "sub" claim in your JWT)
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.Claims.SingleOrDefault(x =>
                    x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )?.Value ?? string.Empty;
        }

        // Get the email claim (use "emailaddress" as it corresponds to the email claim in your JWT)
        public static string GetEmail(this ClaimsPrincipal user)
        {
            return user.Claims.SingleOrDefault(x =>
                    x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                )?.Value ?? string.Empty;
        }

        // Get the full name claim (use "name" for the user's full name)
        public static string GetFullName(this ClaimsPrincipal user)
        {
            return user.Claims.SingleOrDefault(x => x.Type == "name")?.Value ?? string.Empty;
        }

        // Get the user id claim (use "uid" as in your JWT)
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.Claims.SingleOrDefault(x => x.Type == "uid")?.Value ?? string.Empty;
        }

        // Get the roles claim (use the correct type for roles)
        public static IList<string> GetRoles(this ClaimsPrincipal user)
        {
            return user.Claims.Where(x =>
                        x.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    )
                    .Select(x => x.Value)
                    .ToList() ?? new List<string>(); // Ensuring no null list is returned
        }

        // Optionally, retrieve any custom claim
        public static string GetCustomClaim(this ClaimsPrincipal user, string claimType)
        {
            return user.Claims.SingleOrDefault(x => x.Type == claimType)?.Value ?? string.Empty;
        }
    }
}
