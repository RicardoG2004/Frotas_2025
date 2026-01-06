using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace GSLP.Application.Services.Platform.LicencaService.Helpers
{
  public static class FrontendConfigHelper
  {
    public static string GenerateFilename(string? licenseName)
    {
      string licenseSlug = GenerateLicenseSlug(licenseName);
      return $"config-{licenseSlug}.json";
    }

    private static string GenerateLicenseSlug(string? licenseName)
    {
      if (string.IsNullOrWhiteSpace(licenseName))
      {
        return "license";
      }

      // Convert to lowercase
      string slug = licenseName.ToLowerInvariant();

      // Replace spaces with hyphens
      slug = slug.Replace(" ", "-");

      // Remove special characters (keep only alphanumeric and hyphens)
      slug = Regex.Replace(slug, @"[^a-z0-9\-]", string.Empty);

      // Remove multiple consecutive hyphens
      slug = Regex.Replace(slug, @"-+", "-");

      // Trim hyphens from start and end
      slug = slug.Trim('-');

      // If empty after processing, return default
      if (string.IsNullOrEmpty(slug))
      {
        return "license";
      }

      return slug;
    }
  }
}

