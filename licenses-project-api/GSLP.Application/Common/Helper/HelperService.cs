using Microsoft.AspNetCore.Http;

namespace GSLP.Application.Common.Helper
{
    public class HelperService : IHelperService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IRepositoryAsync _repository;

        public HelperService(IHttpContextAccessor httpContextAccessor, IRepositoryAsync repository)
        {
            _httpContextAccessor = httpContextAccessor;
            _repository = repository;
        }

        // Method to retrieve APIKey from HttpContext
        public async Task<string?> GetAPIKeyFromHttpContextAsync()
        {
            return _httpContextAccessor.HttpContext?.Items["APIKey"]?.ToString();
        }

        // Method to retrieve LicencaId from HttpContext
        public async Task<Guid?> GetLicencaIdFromHttpContextAsync()
        {
            string? licencaFromMiddleware = _httpContextAccessor
                .HttpContext?.Items["LicencaId"]
                ?.ToString();
            if (string.IsNullOrEmpty(licencaFromMiddleware))
            {
                return null; // or throw exception if you prefer
            }

            return Guid.Parse(licencaFromMiddleware);
        }

        // Method to retrieve ClienteId from HttpContext
        public async Task<Guid?> GetClienteIdFromHttpContextAsync()
        {
            string? clienteFromMiddleware = _httpContextAccessor
                .HttpContext?.Items["ClienteId"]
                ?.ToString();
            if (string.IsNullOrEmpty(clienteFromMiddleware))
            {
                return null; // or throw exception if you prefer
            }

            return Guid.Parse(clienteFromMiddleware);
        }
    }
}
