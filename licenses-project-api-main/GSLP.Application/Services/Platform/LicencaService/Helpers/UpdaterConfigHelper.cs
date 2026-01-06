using System.Globalization;
using System.Text;

namespace GSLP.Application.Services.Platform.LicencaService.Helpers
{
    public static class UpdaterConfigHelper
    {
        public static string GenerateFilename(string? clienteNome)
        {
            string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture);

            string clientSlug = string.Empty;
            if (!string.IsNullOrEmpty(clienteNome))
            {
                clientSlug = GenerateClientSlug(clienteNome);
            }

            return $"updater-config{(string.IsNullOrEmpty(clientSlug) ? "" : $"-{clientSlug}")}-{timestamp}.json";
        }

        private static string GenerateClientSlug(string clientName)
        {
            // Normalize and create slug (first 10 characters)
            var normalized = clientName
                .ToLowerInvariant()
                .Normalize(NormalizationForm.FormD)
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                .ToArray();

            var slug = new string(normalized)
                .Replace(" ", "-")
                .Replace("_", "-")
                .Where(c => char.IsLetterOrDigit(c) || c == '-')
                .Take(10)
                .ToArray();

            return new string(slug).Trim('-');
        }
    }
}

