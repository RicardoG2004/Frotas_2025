namespace GSLP.Application.Common.Helper
{
    public static class GuidHelper
    {
        public static string ToConsistentString(this Guid guid)
        {
            return guid.ToString().ToUpperInvariant();
        }

        // Optional: Add an overload for string input
        public static string ToConsistentString(this string guidString)
        {
            if (Guid.TryParse(guidString, out Guid guid))
            {
                return guid.ToString().ToUpperInvariant();
            }
            return guidString.ToUpperInvariant();
        }
    }
}
