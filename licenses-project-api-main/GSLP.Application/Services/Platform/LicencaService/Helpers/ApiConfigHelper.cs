using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using GSLP.Application.Utility;

namespace GSLP.Application.Services.Platform.LicencaService.Helpers
{
  public static class ApiConfigHelper
  {
    public static string GenerateFilename(string? licenseName)
    {
      string licenseSlug = GenerateLicenseSlug(licenseName);
      return $"appsettings-{licenseSlug}.json";
    }

    public static string GenerateDatabaseName(string? apiPoolName, string? licenseName)
    {
      // Priority 1: Use ApiPoolName if available
      if (!string.IsNullOrWhiteSpace(apiPoolName))
      {
        string dbName = apiPoolName.Trim();

        // Remove licenca- prefix if present (do this first)
        if (dbName.StartsWith("licenca-", StringComparison.OrdinalIgnoreCase))
        {
          dbName = dbName.Substring(8);
        }

        // Replace -api suffix with -db
        if (dbName.EndsWith("-api", StringComparison.OrdinalIgnoreCase))
        {
          dbName = dbName.Substring(0, dbName.Length - 4) + "-db";
        }
        else
        {
          // If no -api suffix, just append -db
          dbName = dbName + "-db";
        }

        return dbName.ToLowerInvariant();
      }

      // Priority 2: Use license name
      if (string.IsNullOrWhiteSpace(licenseName))
      {
        return "license-db";
      }

      // Convert to lowercase
      string normalized = licenseName.ToLowerInvariant();

      // Normalize (remove accents)
      normalized = GSLPHelpers.RemoveAccents(normalized);

      // Remove special characters (keep only alphanumeric and spaces)
      normalized = Regex.Replace(normalized, @"[^a-z0-9\s]", string.Empty);

      // Replace spaces with hyphens
      normalized = normalized.Replace(" ", "-");

      // Remove multiple consecutive hyphens
      normalized = Regex.Replace(normalized, @"-+", "-");

      // Remove licenca- prefix if present
      if (normalized.StartsWith("licenca-", StringComparison.OrdinalIgnoreCase))
      {
        normalized = normalized.Substring(8);
      }

      // Trim hyphens from start and end
      normalized = normalized.Trim('-');

      // Append -db suffix
      if (string.IsNullOrEmpty(normalized))
      {
        return "license-db";
      }

      return normalized + "-db";
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

