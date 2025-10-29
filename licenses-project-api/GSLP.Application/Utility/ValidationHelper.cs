using FluentValidation.Results;
using GSLP.Application.Common.Wrapper;

namespace GSLP.Application.Utility
{
    public static class ValidationHelper
    {
        public static Response<T>? HandleValidationErrors<T>(ValidationResult validationResult)
        {
            if (!validationResult.IsValid)
            {
                // Group the errors by their property name and return a structured response
                Dictionary<string, List<string>> errors = validationResult
                    .Errors.GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Select(e => e.ErrorMessage).ToList()
                    );

                return Response<T>.Fail(errors); // Return validation errors
            }

            return null; // Return null if validation passes
        }
    }
}
