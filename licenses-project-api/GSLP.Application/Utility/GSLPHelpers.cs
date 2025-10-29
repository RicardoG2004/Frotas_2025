using System.ComponentModel;
using System.Globalization;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using GSLP.Application.Common.Filter;

namespace GSLP.Application.Utility
{
    public static class GSLPHelpers // helper utility methods
    {
        static Random random = new Random();

        public static string GenerateHex(int digits) // hex code generator
        {
            byte[] buffer = new byte[digits / 2];
            random.NextBytes(buffer);
            string result = string.Concat(buffer.Select(x => x.ToString("X2")).ToArray());
            if (digits % 2 == 0)
            {
                return result;
            }

            return result + random.Next(16).ToString("X");
        }

        public static string GetEnumDescription(this Enum value) // retrieve enum descriptions
        {
            FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
            DescriptionAttribute[] attributes = (DescriptionAttribute[])
                fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);

            if (attributes.Length > 0)
            {
                return attributes[0].Description;
            }
            else
            {
                return value.ToString();
            }
        }

        private static readonly Regex _whitespace = new(@"\s+"); // remove whitespace from strings

        public static string ReplaceWhitespace(this string input, string replacement)
        {
            return _whitespace.Replace(input, replacement);
        }

        public static string ToUrlSlug(string value) // generate url slug from string
        {
            // first to lower case
            value = value.ToLowerInvariant();

            // remove all accents
            value = RemoveAccents(value);

            // replace spaces
            value = Regex.Replace(value, @"\s", "-", RegexOptions.Compiled);

            // remove invalid chars
            value = Regex.Replace(value, @"[^a-z0-9\s-_]", "", RegexOptions.Compiled);

            // trim dashes from end
            value = value.Trim('-', '_');

            // replace double occurences of - or _
            value = Regex.Replace(value, @"([-_]){2,}", "$1", RegexOptions.Compiled);

            return value;
        }

        public static string RemoveAccents(string text) // remove accents from string characters
        {
            string normalizedString = text.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new();

            foreach (char c in normalizedString)
            {
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    _ = stringBuilder.Append(c);
                }
            }
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        public static string GenerateOrderByString(PaginationFilter filter)
        {
            // translate a dynamic TanstackColumnOrder List into a string format readable by ardalis specification OrderBy
            // string format example: ('Name,-Supplier,Property.Name,Price') -prefix denotes Descending
            string sortingString = "";
            int numberOfColumns = filter.Sorting.Count;

            int count = 1;
            foreach (TanstackColumnOrder sortColumn in filter.Sorting)
            {
                if (sortColumn.Desc) // prepend a minus if order equals descending
                {
                    sortingString += "-" + sortColumn.Id;
                }
                else
                {
                    sortingString += sortColumn.Id;
                }

                if (count != numberOfColumns) // append comma if not last in series
                {
                    sortingString += ",";
                }
                count++;
            }
            return sortingString;
        }

        public static bool BeAValidGuid(string? stringGuid)
        {
            // Return false if the value is null or empty
            if (string.IsNullOrEmpty(stringGuid))
            {
                return false;
            }

            return Guid.TryParse(stringGuid, out _);
        }

        public static bool BeNotEmptyGuid(string? stringGuid)
        {
            // Return false if the value is null or empty
            if (string.IsNullOrEmpty(stringGuid))
            {
                return false;
            }

            if (Guid.TryParse(stringGuid, out Guid guidValue))
            {
                return guidValue != Guid.Empty;
            }

            return false;
        }

        public static bool BeAValidUrl(string? url)
        {
            // Return false if the value is null or empty
            if (string.IsNullOrEmpty(url))
            {
                return false;
            }

            // Validate if the URL is a valid absolute URI
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }

        // Method to generate a strong API key
        public static string GenerateAPIKey()
        {
            // Create a cryptographic random number generator
            using RandomNumberGenerator rng = RandomNumberGenerator.Create();

            // Create a byte array to hold random data (increase the size for a bigger API key)
            byte[] randomBytes = new byte[64]; // 64 bytes = 512 bits of entropy

            // Fill the byte array with random values
            rng.GetBytes(randomBytes);

            // Convert the byte array to a Base64 string (which will be longer)
            string APIKey = Convert.ToBase64String(randomBytes);

            // If you want the Base64 string to be URL-safe, you can replace characters:
            // APIKey = APIKey.Replace("+", "-").Replace("/", "_").Replace("=", "");

            return APIKey;
        }

        public static string GetSpecificChars(string input, int[] positions)
        {
            // Ensure that the input string is long enough to have the required positions
            foreach (int pos in positions)
            {
                if (pos < 1 || pos > input.Length)
                {
                    throw new ArgumentException($"Position {pos} is out of bounds.");
                }
            }

            // Retrieve the characters from the specified positions (adjust for zero-based indexing)
            StringBuilder result = new();
            foreach (int pos in positions)
            {
                _ = result.Append(input[pos - 1]); // Convert 1-based index to 0-based
            }

            return result.ToString();
        }
    }
}
