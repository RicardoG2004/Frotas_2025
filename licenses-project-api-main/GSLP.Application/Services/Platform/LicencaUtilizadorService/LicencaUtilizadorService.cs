using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Application.Services.Platform.LicencaUtilizadorService
{
    public class LicencaUtilizadorService : BaseService, ILicencaUtilizadorService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILicencaUtilizadorRepository _licencaUtilizadorRepository;

        public LicencaUtilizadorService(
            IRepositoryAsync repository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            ILicencaUtilizadorRepository licencaUtilizadorRepository
        )
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
            _userManager = userManager;
            _licencaUtilizadorRepository = licencaUtilizadorRepository;
        }

        #region [-- LICENCAUTILIZADORSERVICE - API METHODS --]

        // Add Utilizador to Licenca
        public async Task<Response<Guid>> AddUtilizadorToLicencaResponseAsync(
            Guid licencaId,
            LicencaUtilizadorAssociationRequest request
        )
        {
            try
            {
                // Get the Licenca by ID
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licenca não encontrada");
                }

                // Ensure UtilizadorId is not null before using it in FindByIdAsync
                ApplicationUser? utilizador = await _userManager.FindByIdAsync(
                    request.UtilizadorId!
                );
                if (utilizador == null)
                {
                    return Response<Guid>.Fail("Utilizador não encontrado");
                }

                // Check if the ApplicationUser belongs to the same Cliente as the Licenca
                if (licenca.ClienteId != utilizador.ClienteId)
                {
                    return Response<Guid>.Fail(
                        "Este utilizador não pertence ao mesmo cliente da licença"
                    );
                }

                // Check if the relationship already exists (PerfilFuncionalidade)
                bool associationExists = await _licencaUtilizadorRepository.RelationshipExistsAsync(
                    licencaId,
                    request.UtilizadorId!
                );

                if (associationExists)
                {
                    return Response<Guid>.Fail(
                        "Este utilizador já se encontra associado a esta licenca"
                    );
                }

                // Check the current number of associated users with this Licenca
                int currentUtilizadoresCount =
                    await _licencaUtilizadorRepository.GetUtilizadoresAtivosCountByLicencaIdAsync(
                        licencaId
                    );

                // Compare with the maximum allowed number of users (licenca.NumeroUtilizadores)
                if (currentUtilizadoresCount >= licenca.NumeroUtilizadores)
                {
                    return Response<Guid>.Fail(
                        $"A licença já atingiu o número máximo de utilizadores ({licenca.NumeroUtilizadores})"
                    );
                }

                // Add the new relationship to the repository
                await _licencaUtilizadorRepository.AddAsync(licencaId, request);

                return Response<Guid>.Success(licenca.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Add Utilizadores to Licenca
        public async Task<Response<List<Guid>>> AddUtilizadoresToLicencaResponseAsync(
            Guid licencaId,
            List<LicencaUtilizadorAssociationRequest> requests
        )
        {
            List<Guid> successfullyProcessed = []; // List to track successfully added utilizadores
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca from the database
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licenca não encontrada");
                }

                // Loop through each request (utilizador)
                foreach (LicencaUtilizadorAssociationRequest request in requests)
                {
                    try
                    {
                        // Ensure UtilizadorId is not null before using it in FindByIdAsync
                        ApplicationUser? utilizador = await _userManager.FindByIdAsync(
                            request.UtilizadorId!
                        );
                        if (utilizador == null)
                        {
                            failureMessages.Add(
                                $"Utilizador {request.UtilizadorId} não encontrado"
                            );
                            continue; // Skip this utilizador and move to the next
                        }

                        // Check if the ApplicationUser belongs to the same Cliente as the Licenca
                        if (licenca.ClienteId != utilizador.ClienteId)
                        {
                            failureMessages.Add(
                                $"Utilizador {request.UtilizadorId} não pertence ao mesmo cliente da licença"
                            );
                            continue;
                        }

                        // Check if the relationship already exists (PerfilFuncionalidade)
                        bool associationExists =
                            await _licencaUtilizadorRepository.RelationshipExistsAsync(
                                licencaId,
                                request.UtilizadorId!
                            );

                        if (associationExists)
                        {
                            failureMessages.Add(
                                $"Utilizador {request.UtilizadorId} já se encontra associado a esta licenca"
                            );
                            continue;
                        }

                        // **Check the number of utilizadores before adding a new one**
                        int currentUtilizadoresCount =
                            await _licencaUtilizadorRepository.GetUtilizadoresAtivosCountByLicencaIdAsync(
                                licencaId
                            );

                        // Ensure the number of utilizadores doesn't exceed the allowed limit
                        if (currentUtilizadoresCount >= licenca.NumeroUtilizadores)
                        {
                            failureMessages.Add(
                                $"Não é possível adicionar o utilizador pois a licença já atingiu o número máximo de utilizadores ({licenca.NumeroUtilizadores})"
                            );
                            continue;
                        }

                        // Add the new relationship to the repository
                        await _licencaUtilizadorRepository.AddAsync(licencaId, request);

                        // Track the added Utilizador ID
                        successfullyProcessed.Add(Guid.Parse(request.UtilizadorId!));
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add(
                            $"Erro ao processar utilizador com ID {request.UtilizadorId}: {ex.Message}"
                        );
                        continue; // Skip this utilizador and move to the next
                    }
                }

                // Return the result based on whether there were successes or failures
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(successfullyProcessed);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // Remove single Utilizador association from Licenca
        public async Task<Response<Guid>> RemoveUtilizadorFromLicencaResponseAsync(
            Guid licencaId,
            string utilizadorId
        )
        {
            try
            {
                // Retrieve the Licenca from the database
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licenca não encontrada");
                }

                // Check if the relationship already exists (LicencaUtilizador)
                bool associationExists = await _licencaUtilizadorRepository.RelationshipExistsAsync(
                    licencaId,
                    utilizadorId
                );

                // If the relationship doesn't exist, return a failure response
                if (!associationExists)
                {
                    return Response<Guid>.Fail("Este utilizador não está associado à licença");
                }

                // Remove the relationship from the repository
                await _licencaUtilizadorRepository.RemoveLicencaUtilizadorWithAssociationsAsync(
                    licencaId,
                    utilizadorId
                );

                // Return a success response with the licencaId
                return Response<Guid>.Success(Guid.Parse(utilizadorId));
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Remove multiple Utilizadores associations from Licenca
        public async Task<Response<List<Guid>>> RemoveUtilizadoresFromLicencaResponseAsync(
            Guid licencaId,
            List<string> utilizadorIds
        )
        {
            List<Guid> utilizadoresRemoved = []; // List to track successfully removed utilizadores
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca entity from the repository
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licenca não encontrada");
                }

                // Loop through each utilizadorId
                foreach (string utilizadorId in utilizadorIds)
                {
                    try
                    {
                        // Check if the relationship exists (LicencaUtilizador)
                        bool associationExists =
                            await _licencaUtilizadorRepository.RelationshipExistsAsync(
                                licencaId,
                                utilizadorId
                            );

                        // If the relationship doesn't exist, return a failure response
                        if (!associationExists)
                        {
                            failureMessages.Add(
                                $"Utilizador {utilizadorId} não está associado à licença"
                            );
                            continue; // Skip this utilizador and move to the next
                        }

                        // Remove the relationship from the repository
                        await _licencaUtilizadorRepository.RemoveLicencaUtilizadorWithAssociationsAsync(
                            licencaId,
                            utilizadorId
                        );

                        // Track the removed Utilizador ID
                        utilizadoresRemoved.Add(Guid.Parse(utilizadorId));
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add(
                            $"Erro ao remover utilizador {utilizadorId}: {ex.Message}"
                        );
                        continue; // Skip this utilizador and move to the next
                    }
                }

                // Return the result based on whether there were successes or failures
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(utilizadoresRemoved);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // Update Utilizador association from Licenca
        public async Task<Response<Guid>> UpdateLicencaUtilizadorStatusResponseAsync(
            Guid licencaId,
            LicencaUtilizadorAssociationRequest request
        )
        {
            try
            {
                // Retrieve the Licenca entity
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licenca não encontrada");
                }

                // Check if the relationship already exists (PerfilFuncionalidade)
                bool associationExists = await _licencaUtilizadorRepository.RelationshipExistsAsync(
                    licencaId,
                    request.UtilizadorId!
                );

                if (!associationExists)
                {
                    // Check the current number of utilizadores
                    int currentUtilizadoresCount =
                        await _licencaUtilizadorRepository.GetUtilizadoresAtivosCountByLicencaIdAsync(
                            licencaId
                        );

                    // Ensure the number of utilizadores doesn't exceed the allowed limit
                    if (currentUtilizadoresCount >= licenca.NumeroUtilizadores)
                    {
                        return Response<Guid>.Fail(
                            $"Não é possível adicionar o utilizador pois a licença já atingiu o número máximo de utilizadores ({licenca.NumeroUtilizadores})"
                        );
                    }

                    // Add the new relationship to the repository
                    await _licencaUtilizadorRepository.AddAsync(licencaId, request);
                }
                else
                {
                    // Update the relationship to the repository
                    await _licencaUtilizadorRepository.UpdateAsync(licencaId, request);
                }

                return Response<Guid>.Success(licencaId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(
                    $"Erro ao atualizar o estado de 'Ativo' para o utilizador {request.UtilizadorId}: {ex.Message}"
                );
            }
        }

        // Update Utilizadores association from Licenca
        public async Task<Response<List<Guid>>> UpdateLicencaUtilizadoresStatusResponseAsync(
            Guid licencaId,
            List<LicencaUtilizadorAssociationRequest> requests
        )
        {
            List<Guid> successfullyProcessed = []; // List to track successfully added utilizadores
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca from the database
                Licenca licenca = await GetLicencaByIdAsync(licencaId);

                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licenca não encontrada");
                }

                // Count how many activations are requested
                int requestedActivations = requests.Count(r => r.Ativo == true);

                // Check if the total would exceed the limit
                if (requestedActivations > licenca.NumeroUtilizadores)
                {
                    return Response<List<Guid>>.Fail(
                        $"Não é possível ativar {requestedActivations} utilizadores pois excede o número máximo permitido ({licenca.NumeroUtilizadores})"
                    );
                }

                // Loop through each request (utilizador)
                foreach (LicencaUtilizadorAssociationRequest request in requests)
                {
                    try
                    {
                        // Ensure UtilizadorId is not null before using it in FindByIdAsync
                        ApplicationUser? utilizador = await _userManager.FindByIdAsync(
                            request.UtilizadorId!
                        );
                        if (utilizador == null)
                        {
                            failureMessages.Add(
                                $"Utilizador {request.UtilizadorId} não encontrado"
                            );
                            continue; // Skip this utilizador and move to the next
                        }

                        // Check if the ApplicationUser belongs to the same Cliente as the Licenca
                        if (licenca.ClienteId != utilizador.ClienteId)
                        {
                            failureMessages.Add(
                                $"Utilizador {request.UtilizadorId} não pertence ao mesmo cliente da licença"
                            );
                            continue;
                        }

                        // Check if the relationship already exists
                        bool associationExists =
                            await _licencaUtilizadorRepository.RelationshipExistsAsync(
                                licencaId,
                                request.UtilizadorId!
                            );

                        if (!associationExists)
                        {
                            // Add the new relationship to the repository
                            await _licencaUtilizadorRepository.AddAsync(licencaId, request);
                        }
                        else
                        {
                            // Update the relationship in the repository
                            await _licencaUtilizadorRepository.UpdateAsync(licencaId, request);
                        }

                        // Track the successfully processed Utilizador ID
                        successfullyProcessed.Add(Guid.Parse(request.UtilizadorId!));
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add(
                            $"Erro ao processar utilizador com ID {request.UtilizadorId}: {ex.Message}"
                        );
                        continue; // Skip this utilizador and move to the next
                    }
                }

                // Return the result based on whether there were successes or failures
                if (failureMessages.Count > 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(successfullyProcessed);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        public async Task<List<string>?> UpdateLicencaUtilizadorStatusResponseAsync(
            Guid licencaId,
            string utilizadorId,
            bool ativo
        )
        {
            List<string> errorMessages = new();

            try
            {
                // Retrieve the Licenca entity
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    errorMessages.Add("Licenca não encontrada");
                    return errorMessages;
                }

                // Get user and check role
                ApplicationUser? user = await _userManager.FindByIdAsync(utilizadorId);
                if (user == null)
                {
                    errorMessages.Add("Utilizador não encontrado");
                    return errorMessages;
                }

                IList<string> userRoles = await _userManager.GetRolesAsync(user);
                bool isAdminRole = userRoles.Any(r => r is "admin" or "administrator");

                // Get all existing license associations for the user
                var existingAssociations =
                    await _licencaUtilizadorRepository.GetExistingLicencaAssociationsAsync(
                        utilizadorId,
                        licencaId
                    );

                // Remove all existing associations
                if (existingAssociations.Any())
                {
                    foreach (var association in existingAssociations)
                    {
                        await _licencaUtilizadorRepository.RemoveAsync(
                            association.LicencaId,
                            utilizadorId
                        );
                    }
                }

                // Check if the relationship with the new license already exists
                bool associationExists = await _licencaUtilizadorRepository.RelationshipExistsAsync(
                    licencaId,
                    utilizadorId
                );

                if (!associationExists)
                {
                    // For client role, check user limit only if trying to activate
                    if (!isAdminRole && ativo)
                    {
                        int currentUtilizadoresCount =
                            await _licencaUtilizadorRepository.GetUtilizadoresAtivosCountByLicencaIdAsync(
                                licencaId
                            );

                        // If limit reached for client role, add as inactive
                        if (currentUtilizadoresCount >= licenca.NumeroUtilizadores)
                        {
                            await _licencaUtilizadorRepository.AddAsync(
                                licencaId,
                                utilizadorId,
                                false
                            );
                            errorMessages.Add(
                                $"O utilizador foi associado à licença mas com estado inativo pois a licença já atingiu o número máximo de utilizadores ({licenca.NumeroUtilizadores})"
                            );
                            return errorMessages;
                        }
                    }

                    // Add new relationship - for admin roles always use requested status
                    await _licencaUtilizadorRepository.AddAsync(licencaId, utilizadorId, ativo);
                }
                else
                {
                    // For existing relationship, check limit only for client role activation
                    if (!isAdminRole && ativo)
                    {
                        int currentUtilizadoresCount =
                            await _licencaUtilizadorRepository.GetUtilizadoresAtivosCountByLicencaIdAsync(
                                licencaId
                            );

                        if (currentUtilizadoresCount >= licenca.NumeroUtilizadores)
                        {
                            await _licencaUtilizadorRepository.UpdateAsync(
                                licencaId,
                                utilizadorId,
                                false
                            );
                            errorMessages.Add(
                                $"Não é possível ativar o utilizador pois a licença já atingiu o número máximo de utilizadores ({licenca.NumeroUtilizadores})"
                            );
                            return errorMessages;
                        }
                    }

                    // Update relationship status - for admin roles always use requested status
                    await _licencaUtilizadorRepository.UpdateAsync(licencaId, utilizadorId, ativo);
                }
            }
            catch (Exception ex)
            {
                errorMessages.Add(
                    $"Erro ao atualizar o estado de 'Ativo' para o utilizador {utilizadorId}: {ex.Message}"
                );
            }

            return errorMessages.Count > 0 ? errorMessages : null;
        }

        // get Utilizadores from Licenca
        public async Task<
            Response<IEnumerable<LicencaUtilizadorDTO>>
        > GetUtilizadoresByLicencaIdResponseAsync(Guid licencaId, string? role = null)
        {
            try
            {
                IEnumerable<LicencaUtilizadorDTO> list =
                    await _licencaUtilizadorRepository.GetUtilizadoresByLicencaIdAsync(
                        licencaId,
                        role!
                    );

                return Response<IEnumerable<LicencaUtilizadorDTO>>.Success(list);
            }
            catch (Exception ex)
            {
                // If any error occurs, return a failure response with the exception message
                return Response<IEnumerable<LicencaUtilizadorDTO>>.Fail(ex.Message);
            }
        }

        public async Task<bool> HasUserAnyLicencaAssociationAsync(string utilizadorId)
        {
            return await _licencaUtilizadorRepository.HasUserAnyLicencaAssociationAsync(
                utilizadorId
            );
        }

        #endregion [-- LICENCAUTILIZADORSERVICE - API METHODS --]
    }
}
