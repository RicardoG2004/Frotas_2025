using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaAPIKeyService
{
    public class LicencaAPIKeyService : BaseService, ILicencaAPIKeyService
    {
        private readonly IHelperService _helperService;

        #region [-- LICENCAFUNCIONALIDADESERVICE - API METHODS --]

        public LicencaAPIKeyService(IRepositoryAsync repository, IHelperService helperService)
            : base(repository)
        {
            _helperService = helperService;
        }

        public async Task<Response<Guid>> CreateLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            try
            {
                // Retrieve the Licenca by Id
                Licenca licenca = await GetLicencaByIdAsync(licencaId);

                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licença não encontrada");
                }

                LicencaAPIKey licencaAPIKey = new()
                {
                    APIKey = GSLPHelpers.GenerateAPIKey(), // Implement a method to generate the API key
                    LicencaId = licencaId, // Associate it with the Licenca
                    Ativo = true,
                };

                // Save the API Key
                _ = await _repository.CreateAsync<LicencaAPIKey, Guid>(licencaAPIKey);
                _ = await _repository.SaveChangesAsync(); // Save the changes to the API key

                return Response<Guid>.Success(licencaAPIKey.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<Guid>> SetLicencaAPIKeyStatusResponseAsync(
            Guid licencaId,
            SetLicencaAPIKeyStatusRequest request
        )
        {
            try
            {
                // Retrieve the Licenca by Id
                Licenca licenca = await GetLicencaByIdAsync(licencaId);

                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licença não encontrada");
                }

                // Check if the Licenca has an associated LicencaAPIKey
                if (licenca.LicencaAPIKey != null)
                {
                    // Set the LicencaAPIKey's 'Ativo' status based on the 'isActive' parameter
                    licenca.LicencaAPIKey.Ativo = request.IsActive;

                    // Update the LicencaAPIKey in the database
                    _ = await _repository.UpdateAsync<LicencaAPIKey, Guid>(licenca.LicencaAPIKey);
                    _ = await _repository.SaveChangesAsync(); // Save changes to the ApiKey

                    return Response<Guid>.Success(licencaId);
                }
                else
                {
                    return Response<Guid>.Fail(
                        "Não foi encontrada nenhuma chave de API associada a esta Licença"
                    );
                }
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(
                    $"Ocorreu um erro ao definir o estado da chave de API: {ex.Message}"
                );
            }
        }

        public async Task<Response<Guid>> RegenerateLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            try
            {
                // Get the current API key from the request
                string? currentAPIKey = await _helperService.GetAPIKeyFromHttpContextAsync();
                if (string.IsNullOrEmpty(currentAPIKey))
                {
                    return Response<Guid>.Fail("API Key em falta");
                }

                // Retrieve the Licenca by Id
                Licenca licenca = await GetLicencaByIdAsync(licencaId);

                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licença não encontrada");
                }

                // If there's an existing API key, check if it's the same as the current request
                if (licenca.LicencaAPIKey != null)
                {
                    if (licenca.LicencaAPIKey.APIKey == currentAPIKey)
                    {
                        return Response<Guid>.Fail("Não é possível gerar a própria chave de API");
                    }

                    // Update existing API key
                    licenca.LicencaAPIKey.APIKey = GSLPHelpers.GenerateAPIKey();
                    _ = await _repository.UpdateAsync<LicencaAPIKey, Guid>(licenca.LicencaAPIKey);
                }
                else
                {
                    // Create new API key if none exists
                    LicencaAPIKey licencaAPIKey = new()
                    {
                        APIKey = GSLPHelpers.GenerateAPIKey(),
                        LicencaId = licencaId,
                        Ativo = true,
                    };
                    _ = await _repository.CreateAsync<LicencaAPIKey, Guid>(licencaAPIKey);
                }

                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(licencaId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(
                    $"Ocorreu um erro ao gerar a chave da API: {ex.Message}"
                );
            }
        }

        public async Task<Response<LicencaAPIKeyDTO>> GetLicencaAPIKeyResponseAsync(Guid licencaId)
        {
            try
            {
                // Retrieve the Licenca by Id
                Licenca licenca = await GetLicencaByIdAsync(licencaId);

                if (licenca == null)
                {
                    return Response<LicencaAPIKeyDTO>.Fail("Licença não encontrada");
                }

                if (licenca.LicencaAPIKey == null)
                {
                    return Response<LicencaAPIKeyDTO>.Fail(
                        "Chave de API não encontrada para esta licença"
                    );
                }

                var licencaAPIKeyDTO = new LicencaAPIKeyDTO
                {
                    APIKey = licenca.LicencaAPIKey.APIKey,
                    Ativo = licenca.LicencaAPIKey.Ativo,
                };

                return Response<LicencaAPIKeyDTO>.Success(licencaAPIKeyDTO);
            }
            catch (Exception ex)
            {
                return Response<LicencaAPIKeyDTO>.Fail(
                    $"Erro ao obter a chave de API: {ex.Message}"
                );
            }
        }

        #endregion [-- LICENCAFUNCIONALIDADESERVICE - API METHODS --]
    }
}
