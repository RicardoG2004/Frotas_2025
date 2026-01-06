using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Results;
using GSLP.Application.Common.Errors;
using Microsoft.AspNetCore.Mvc;

namespace GSLP.WebApi.Interceptors
{
    public class UseCustomErrorModelInterceptor : IValidatorInterceptor
    {
        // This method can be used to perform any logic before validation starts.
        public IValidationContext BeforeAspNetValidation(
            ActionContext actionContext,
            IValidationContext commonContext
        )
        {
            return commonContext; // Return the default validation context.
        }

        // This method intercepts the result after validation has been performed.
        public ValidationResult AfterAspNetValidation(
            ActionContext actionContext,
            IValidationContext validationContext,
            ValidationResult result
        )
        {
            if (result.Errors.Count != 0)
            {
                // Create a dictionary to store field names and their corresponding error messages
                Dictionary<string, List<string>> errorMessages = [];

                // Loop through each validation error
                foreach (ValidationFailure? error in result.Errors)
                {
                    // Check if the field already exists in the dictionary
                    if (!errorMessages.TryGetValue(error.PropertyName, out List<string>? value))
                    {
                        value = [];
                        // If the field doesn't exist, add it with an empty list
                        errorMessages[error.PropertyName] = value;
                    }

                    value.Add(error.ErrorMessage);
                }

                // Throw a BadRequestException with the validation error messages
                throw new BadRequestException("Validation failed", errorMessages);
            }

            // If no validation errors, return the original result
            return result;
        }
    }
}
