using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;

namespace GSLP.Application.Services.Platform.PerfilUtilizadorService
{
    public class PerfilUtilizadorService : BaseService, IPerfilUtilizadorService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;
        private readonly IPerfilUtilizadorRepository _perfilUtilizadorRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public PerfilUtilizadorService(
            IRepositoryAsync repository,
            IMapper mapper,
            IPerfilUtilizadorRepository perfilUtilizadorRepository,
            UserManager<ApplicationUser> userManager
        )
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
            _perfilUtilizadorRepository = perfilUtilizadorRepository;
            _userManager = userManager;
        }

        #region [-- PERFILUTILIZADORSERVICE - API METHODS --]

        // Add Utilizador to Perfil
        public async Task<Response<Guid>> AddUtilizadorToPerfilResponseAsync(
            Guid perfilId,
            string utilizadorId
        )
        {
            try
            {
                // Retrieve the Perfil entity from the repository
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<Guid>.Fail("Perfil não encontrado");
                }

                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licenca não encontrada");
                }

                // Check if the Utilizador exists in the Licenca.LicencasUtilizadores collection
                bool utilizadorExistsInLicenca = licenca.LicencasUtilizadores.Any(lf =>
                    lf.UtilizadorId == utilizadorId
                );

                if (!utilizadorExistsInLicenca)
                {
                    return Response<Guid>.Fail("Utilizador não se encontra associado à licença");
                }

                // Check if the relationship already exists (PerfilUtilizador)
                bool associationExists = await _perfilUtilizadorRepository.RelationshipExistsAsync(
                    perfilId,
                    utilizadorId
                );

                // If the relationship exists, return a failure response
                if (associationExists)
                {
                    return Response<Guid>.Fail("Utilizador já se encontra associado ao perfil");
                }

                // Add the new relationship to the repository
                await _perfilUtilizadorRepository.AddAsync(perfilId, utilizadorId);

                // Return a success response with the perfilId
                return Response<Guid>.Success(perfilId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> AddUtilizadoresToPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        )
        {
            List<Guid> utilizadoresAdded = []; // List to track successfully added utilizadores
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Perfil entity from the repository
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licenca não encontrada");
                }

                // Loop through each utilizadorId
                foreach (string utilizadorId in utilizadorIds)
                {
                    // Check if the Utilizador exists in the Licenca.LicencasUtilizadores collection
                    bool utilizadorExistsInLicenca = licenca.LicencasUtilizadores.Any(lf =>
                        lf.UtilizadorId == utilizadorId
                    );

                    if (!utilizadorExistsInLicenca)
                    {
                        failureMessages.Add(
                            $"Utilizador {utilizadorId} não se encontra associado à licença"
                        );
                        continue; // Skip this utilizador and move to the next
                    }

                    // Check if the relationship already exists (PerfilUtilizador)
                    bool associationExists =
                        await _perfilUtilizadorRepository.RelationshipExistsAsync(
                            perfilId,
                            utilizadorId
                        );
                    if (associationExists)
                    {
                        failureMessages.Add(
                            $"Utilizador {utilizadorId} já se encontra associado ao perfil"
                        );
                        continue; // Skip this utilizador and move to the next
                    }

                    try
                    {
                        // Add the new relationship to the repository
                        await _perfilUtilizadorRepository.AddAsync(perfilId, utilizadorId);

                        // Track the added Utilizador ID
                        utilizadoresAdded.Add(perfilId);
                    }
                    catch (Exception ex)
                    {
                        // Handle any exception during the addition
                        failureMessages.Add(
                            $"Erro ao processar utilizador {utilizadorId}: {ex.Message}"
                        );
                    }
                }

                // If there are failure messages, return them
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Return the successfully added utilizadores
                return Response<List<Guid>>.Success(utilizadoresAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        public async Task<Response<Guid>> RemoveUtilizadorFromPerfilResponseAsync(
            Guid perfilId,
            string utilizadorId
        )
        {
            try
            {
                // Retrieve the Perfil entity from the repository
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<Guid>.Fail("Perfil não encontrado");
                }

                // Check if the relationship exists (PerfilUtilizador)
                bool associationExists = await _perfilUtilizadorRepository.RelationshipExistsAsync(
                    perfilId,
                    utilizadorId
                );

                // If the relationship doesn't exist, return a failure response
                if (!associationExists)
                {
                    return Response<Guid>.Fail("Este utilizador não está associado ao perfil");
                }

                // Remove the relationship from the repository
                await _perfilUtilizadorRepository.RemoveAsync(perfilId, utilizadorId);

                // Return a success response with the perfilId
                return Response<Guid>.Success(perfilId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> RemoveUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        )
        {
            List<Guid> utilizadoresRemoved = []; // List to track successfully removed utilizadores
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Perfil entity from the repository
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                // Loop through each utilizadorId
                foreach (string utilizadorId in utilizadorIds)
                {
                    try
                    {
                        // Check if the relationship exists (PerfilUtilizador)
                        bool associationExists =
                            await _perfilUtilizadorRepository.RelationshipExistsAsync(
                                perfilId,
                                utilizadorId
                            );

                        // If the relationship doesn't exist, return a failure response
                        if (!associationExists)
                        {
                            failureMessages.Add(
                                $"Utilizador {utilizadorId} não está associado a este perfil"
                            );
                            continue; // Skip this utilizador and move to the next
                        }

                        // Remove the relationship from the repository
                        await _perfilUtilizadorRepository.RemoveAsync(perfilId, utilizadorId);

                        // Track the removed Utilizador ID
                        utilizadoresRemoved.Add(perfilId);
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

        public async Task<Response<List<string>>> UpdateUtilizadoresFromPerfilResponseAsync(
            Guid perfilId,
            List<string> utilizadorIds
        )
        {
            List<string> failureMessages = [];

            try
            {
                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<string>>.Fail("Perfil não encontrado");
                }

                // Retrieve the Licenca associated with the Perfil
                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    return Response<List<string>>.Fail("Licenca não encontrada");
                }

                // Step 1: Extract only valid UtilizadorIds that belong to the Licenca
                List<string> validUtilizadoresIds = GetLicencaValidUtilizadorIds(
                    utilizadorIds,
                    licenca
                );

                // Step 2: Filter utilizadores based on valid IDs
                List<string> validUtilizadores = utilizadorIds
                    .Where(validUtilizadoresIds.Contains)
                    .ToList();

                // Step 3: Track invalid utilizadores that do not belong to the Licenca
                List<string> invalidUtilizadores = utilizadorIds
                    .Where(id => !validUtilizadoresIds.Contains(id))
                    .ToList();

                // Add failure messages for invalid utilizadores
                if (invalidUtilizadores.Count != 0)
                {
                    failureMessages.Add(
                        "Os seguintes utilizadores não pertencem à licença: "
                            + string.Join(", ", invalidUtilizadores)
                    );
                }

                // Step 4: Keep the utilizadores that are in the provided list, remove the rest
                (List<string> utilizadoresKept, List<string> utilizadoresRemoved) =
                    await CleanUpUtilizadoresAsync(perfil, validUtilizadoresIds);

                // Step 5: Add or update utilizadores
                (List<string> utilizadoresAdded, List<string> utilizadoresUpdated) =
                    await AddOrUpdateUtilizadoresAsync(perfil, validUtilizadores, failureMessages);

                // Step 6: Check if there were any updates (additions, removals, or failures)
                bool hasUpdates =
                    utilizadoresAdded.Count > 0
                    || utilizadoresUpdated.Count > 0
                    || utilizadoresRemoved.Count > 0
                    || failureMessages.Count > 0;

                // If no updates (no additions, no removals, no failures), return "Nada para atualizar"
                if (!hasUpdates)
                {
                    return Response<List<string>>.Fail("Nada para atualizar");
                }

                // Return the result with added and removed utilizadores and any failures
                if (failureMessages.Count > 0)
                {
                    return Response<List<string>>.Fail(failureMessages);
                }

                // Step 7: Return the response with added, updated, and removed utilizadores
                List<string> result = new(utilizadoresAdded);
                result.AddRange(utilizadoresUpdated);
                result.AddRange(utilizadoresRemoved);

                return Response<List<string>>.Success(result);
            }
            catch (Exception ex)
            {
                return Response<List<string>>.Fail(ex.Message);
            }
        }

        public async Task<List<string>?> UpdateUtilizadorWithOnePerfilAsync(
            Guid perfilId,
            string utilizadorId
        )
        {
            List<string> failureMessages = new();

            try
            {
                // Check if the Perfil is valid
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    failureMessages.Add("Perfil não encontrado");
                    return failureMessages; // Return failure messages
                }

                // Retrieve the Licenca associated with the Perfil
                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    failureMessages.Add("Licenca não encontrada");
                    return failureMessages; // Return failure messages
                }

                // Retrieve the Utilizador by ID
                ApplicationUser? utilizador = await _userManager.FindByIdAsync(utilizadorId);
                if (utilizador == null)
                {
                    failureMessages.Add("Utilizador não encontrado");
                    return failureMessages; // Return failure messages
                }

                // Step 1: Remove any existing relationships the user has with other Perfis
                IEnumerable<PerfilDTO> existingPerfis =
                    await _perfilUtilizadorRepository.GetPerfisByUtilizadorIdAsync(utilizadorId);
                foreach (PerfilDTO existingPerfil in existingPerfis)
                {
                    Guid existingPerfilId = Guid.Parse(existingPerfil.Id!);

                    // Ensure we don't remove the current profile
                    if (existingPerfilId != perfil.Id)
                    {
                        await _perfilUtilizadorRepository.RemoveAsync(
                            existingPerfilId,
                            utilizadorId
                        );
                    }
                }

                // Step 2: Check if the user is already associated with the perfil
                bool isPerfilAlreadyAssigned = existingPerfis.Any(p =>
                    Guid.Parse(p.Id!) == perfil.Id
                );
                if (!isPerfilAlreadyAssigned)
                {
                    // Add the new relationship only if it doesn't already exist
                    await _perfilUtilizadorRepository.AddAsync(perfil.Id, utilizadorId);
                }

                return null; // Indicate success by returning null
            }
            catch (Exception ex)
            {
                failureMessages.Add($"Erro ao associar o utilizador: {ex.Message} ao perfil");
                return failureMessages; // Return failure messages
            }
        }

        // Get all Perfis associated with a specific UtilizadorId
        public async Task<IEnumerable<PerfilDTO>> GetPerfisByUtilizadorIdAsync(string utilizadorId)
        {
            try
            {
                // Call the repository method to get profiles associated with the user
                IEnumerable<PerfilDTO> perfis =
                    await _perfilUtilizadorRepository.GetPerfisByUtilizadorIdAsync(utilizadorId);

                // Return the list of profiles
                return perfis;
            }
            catch (Exception ex)
            {
                // Log the exception as needed
                // Optionally, you could return an empty list or handle it differently
                throw new Exception("Ocorreu um erro ao obter os perfis do utilizador.", ex);
            }
        }

        // get Utilizadores from Perfil
        public async Task<Response<IEnumerable<UserDto>>> GetUtilizadoresByPerfilIdResponseAsync(
            Guid perfilId,
            string? role = null
        )
        {
            try
            {
                IEnumerable<UserDto> utilizadores =
                    await _perfilUtilizadorRepository.GetUtilizadoresByPerfilIdAsync(
                        perfilId,
                        role
                    );

                return Response<IEnumerable<UserDto>>.Success(utilizadores);
            }
            catch (Exception ex)
            {
                // If any error occurs, return a failure response with the exception message
                return Response<IEnumerable<UserDto>>.Fail(ex.Message);
            }
        }

        #endregion [-- PERFILUTILIZADORSERVICE - API METHODS --]

        #region [-- PERFILUTILIZADORSERVICE - INTERNAL METHODS --]

        private async Task<(
            List<string> utilizadoresAdded,
            List<string> utilizadoresUpdated
        )> AddOrUpdateUtilizadoresAsync(
            Perfil perfil,
            List<string> utilizadoresIds,
            List<string> failureMessages
        )
        {
            List<string> utilizadoresAdded = [];
            List<string> utilizadoresUpdated = [];

            foreach (string utilizadorId in utilizadoresIds)
            {
                // Retrieve the Utilizador by ID
                ApplicationUser? utilizador = await _userManager.FindByIdAsync(utilizadorId);
                if (utilizador == null)
                {
                    failureMessages.Add($"Utilizador {utilizadorId} não encontrado.");
                    continue; // Skip if Utilizador does not exist
                }

                // Check if the Utilizador is already associated with the Perfil
                bool associationUtilizadorExists =
                    await _perfilUtilizadorRepository.RelationshipExistsAsync(
                        perfil.Id,
                        utilizadorId
                    );

                if (associationUtilizadorExists)
                {
                    // If the relationship exists, update it
                    await _perfilUtilizadorRepository.UpdateAsync(perfil.Id, utilizadorId);
                    utilizadoresUpdated.Add(utilizadorId); // Track updated users
                }
                else
                {
                    // If the relationship doesn't exist, add the new association
                    await _perfilUtilizadorRepository.AddAsync(perfil.Id, utilizadorId);
                    utilizadoresAdded.Add(utilizadorId); // Track added users
                }
            }

            return (utilizadoresAdded, utilizadoresUpdated);
        }

        private async Task<(
            List<string> utilizadoresKept,
            List<string> utilizadoresRemoved
        )> CleanUpUtilizadoresAsync(Perfil perfil, List<string> utilizadorIds)
        {
            List<string> utilizadoresKept = []; // List to track kept users
            List<string> utilizadoresRemoved = []; // List to track removed users

            // Convert utilizadorIds to a HashSet for faster lookup
            HashSet<string> utilizadorIdsSet = new(utilizadorIds);

            // Create a list of PerfilUtilizador objects to remove (those not in utilizadorIds)
            List<PerfilUtilizador> utilizadoresToRemove = [];

            // Retrieve the Licenca associated with the Perfil
            Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
            if (licenca == null)
            {
                return (utilizadoresKept, utilizadoresRemoved); // If Licenca is not found, just return the lists (no changes).
            }

            foreach (PerfilUtilizador perfilUtilizador in perfil.PerfisUtilizadores)
            {
                if (utilizadorIdsSet.Contains(perfilUtilizador.UtilizadorId))
                {
                    // If the Utilizador is kept, add to the successfullyKept list
                    utilizadoresKept.Add(perfilUtilizador.UtilizadorId);
                }
                else
                {
                    // If the Utilizador is not kept, mark it for removal
                    utilizadoresToRemove.Add(perfilUtilizador);
                }
            }

            // Remove the unwanted utilizadores and track them as removed
            foreach (PerfilUtilizador perfilUtilizador in utilizadoresToRemove)
            {
                await _perfilUtilizadorRepository.RemoveAsync(
                    perfilUtilizador.PerfilId,
                    perfilUtilizador.UtilizadorId
                );
                utilizadoresRemoved.Add(perfilUtilizador.UtilizadorId); // Track the removed UtilizadorId
            }

            return (utilizadoresKept, utilizadoresRemoved); // Return tuple with both kept and removed UtilizadorIds
        }

        private static List<string> GetLicencaValidUtilizadorIds(
            List<string> utilizadorIds,
            Licenca licenca
        )
        {
            // Convert the Licenca.LicencasUtilizadores into a HashSet for faster lookup
            HashSet<string> licencaUtilizadoresIds = new(
                licenca.LicencasUtilizadores.Select(lu => lu.UtilizadorId)
            );

            // Extract only the valid UtilizadorIds that belong to the Licenca
            return utilizadorIds
                .Where(utilizadorId => !string.IsNullOrEmpty(utilizadorId)) // Ensure valid IDs
                .Where(licencaUtilizadoresIds.Contains) // Filter out UtilizadorIds not in Licenca
                .ToList(); // Convert to List<string>
        }

        #endregion [-- PERFILUTILIZADORSERVICE - INTERNAL METHODS --]
    }
}
