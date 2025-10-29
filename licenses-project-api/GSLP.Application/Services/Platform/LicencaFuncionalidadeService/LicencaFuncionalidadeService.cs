using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaFuncionalidadeService
{
    public class LicencaFuncionalidadeService : BaseService, ILicencaFuncionalidadeService
    {
        private readonly IRepositoryAsync _repository;
        private readonly ILicencaFuncionalidadeRepository _licencaFuncionalidadeRepository;
        private readonly ILicencaModuloRepository _licencaModuloRepository;

        public LicencaFuncionalidadeService(
            IRepositoryAsync repository,
            ILicencaFuncionalidadeRepository licencaFuncionalidadeRepository,
            ILicencaModuloRepository licencaModuloRepository
        )
            : base(repository)
        {
            _repository = repository;
            _licencaFuncionalidadeRepository = licencaFuncionalidadeRepository;
            _licencaModuloRepository = licencaModuloRepository;
        }

        #region [-- LICENCAFUNCIONALIDADESERVICE - API METHODS --]

        // Add Funcionalidade to Licenca
        public async Task<Response<Guid>> AddFuncionalidadeToLicencaResponseAsync(
            Guid licencaId,
            Guid funcionalidadeId
        )
        {
            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licença não encontrada");
                }

                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    return Response<Guid>.Fail("Funcionalidade não encontrada");
                }

                // Check if the Funcionalidade belongs to the same Aplicacao as the Licenca
                if (funcionalidade.Modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    return Response<Guid>.Fail(
                        "Esta funcionalidade não pertence à mesma aplicação da licença"
                    );
                }

                // Check if the relationship already exists (LicencaFuncionalidade)
                bool associationExists =
                    await _licencaFuncionalidadeRepository.RelationshipExistsAsync(
                        licencaId,
                        funcionalidadeId
                    );

                // If the relationship exists, return a failure response
                if (associationExists)
                {
                    return Response<Guid>.Fail(
                        "Esta funcionalidade já se encontra associada a esta licenca"
                    );
                }

                // Add the new relationship to the repository
                await _licencaFuncionalidadeRepository.AddAsync(licencaId, funcionalidadeId);

                return Response<Guid>.Success(licenca.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Add multiple Funcionalidades to Licenca
        public async Task<Response<List<Guid>>> AddFuncionalidadesToLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        )
        {
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licença não encontrada");
                }

                // Step 1: Add new associations for funcionalidades
                List<Guid> funcionalidadesAdded = await AddFuncionalidadesAsync(
                    licenca,
                    funcionalidadesIds,
                    failureMessages
                );

                // Step 2: Determine if there are updates
                bool hasUpdates = funcionalidadesAdded.Count > 0 || failureMessages.Count > 0;

                // Step 3: If no updates, return "Nada para atualizar"
                if (!hasUpdates)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // Step 4: Return failure messages if any
                if (failureMessages.Count > 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Return successfully added functionalities
                return Response<List<Guid>>.Success(funcionalidadesAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // remove Funcionalidade from Licenca
        public async Task<Response<Guid>> RemoveFuncionalidadeFromLicencaResponseAsync(
            Guid licencaId,
            Guid funcionalidadeId
        )
        {
            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licença não encontrada");
                }

                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    return Response<Guid>.Fail("Funcionalidade não encontrada");
                }

                // Check if the relationship already exists (LicencaFuncionalidade)
                bool associationExists =
                    await _licencaFuncionalidadeRepository.RelationshipExistsAsync(
                        licencaId,
                        funcionalidadeId
                    );

                // If the relationship doesn't exists, return a failure response
                if (!associationExists)
                {
                    return Response<Guid>.Fail(
                        "Esta funcionalidade não está associada a esta licença"
                    );
                }

                // Remove the relationship to the repository
                await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                    licencaId,
                    funcionalidadeId
                );

                return Response<Guid>.Success(licenca.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // remove multiple Funcionalidades from Licenca
        public async Task<Response<List<Guid>>> RemoveFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        )
        {
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licença não encontrada");
                }

                // Step 1: Remove associations for funcionalidades that are no longer in the list
                List<Guid> funcionalidadesRemoved = await RemoveFuncionalidadesAsync(
                    licenca,
                    funcionalidadesIds
                );

                // Step 2: If no funcionalidades were removed, return a "Nada para remover" message
                if (funcionalidadesRemoved.Count == 0)
                {
                    return Response<List<Guid>>.Fail("Nada para remover");
                }

                // Step 3: If there are any failures, include them in the response message
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(funcionalidadesRemoved);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // update Funcionalidades from Licenca
        public async Task<Response<List<Guid>>> UpdateFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> funcionalidadesIds
        )
        {
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licença não encontrada");
                }

                // Step 1: Keep the funcionalidades that are in the provided list, remove the rest
                (List<Guid> funcionalidadesKept, List<Guid> funcionalidadesRemoved) =
                    await CleanUpAndKeepFuncionalidadesAsync(licenca, funcionalidadesIds);

                // Step 2: Add new associations for funcionalidades
                List<Guid> funcionalidadesAdded = await AddFuncionalidadesAsync(
                    licenca,
                    funcionalidadesIds,
                    failureMessages
                );

                // Step 3: Check if there are updates
                // Consider if any funcionalidades have been removed or added successfully
                bool hasUpdates =
                    funcionalidadesAdded.Count > 0
                    || funcionalidadesRemoved.Count > 0
                    || failureMessages.Count > 0;

                // If no updates, return "Nada para atualizar"
                if (!hasUpdates)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // Step 4: Return response with failure messages or success
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Combine added and removed functionalities in the response
                List<Guid> result =
                [
                    .. funcionalidadesAdded, // Add successfully processed (added) functionalities
                    .. funcionalidadesRemoved, // Add removed functionalities
                ];

                return Response<List<Guid>>.Success(result);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // update Modulos and Funcionalidades from Licenca
        public async Task<
            Response<List<Guid>>
        > UpdateModulosFuncionalidadesFromLicencaResponseAsync(
            Guid licencaId,
            List<UpdateModulosFuncionalidadesRequest> request
        )
        {
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Licenca with all the includes
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licença não encontrada");
                }

                // Step 1: Remove associations for funcionalidades that are no longer in the list
                (List<Guid> funcionalidadesRemoved, List<Guid> modulosRemoved) =
                    await CleanUpUnusedModulosAndFuncionalidadesAsync(licenca, request);

                // Step 2: Add modulos and funcionalidades
                (List<Guid> modulosAdded, List<Guid> funcionalidadesAdded) =
                    await AddModulosAndFuncionalidadesAsync(licenca, request, failureMessages);

                // Step 3: Check if there are updates
                // Consider if any funcionalidades or modulos have been removed or if any new funcionalidades were successfully added
                bool hasUpdates =
                    funcionalidadesAdded.Count > 0
                    || modulosAdded.Count > 0
                    || failureMessages.Count > 0
                    || funcionalidadesRemoved.Count > 0
                    || modulosRemoved.Count > 0;

                // If no updates, return "Nada para atualizar"
                if (!hasUpdates)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // Step 4: Return response with failure messages or success
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Combine added and removed functionalities and modulos in the response
                List<Guid> result =
                [
                    .. funcionalidadesAdded,
                    .. funcionalidadesRemoved,
                    .. modulosAdded,
                    .. modulosRemoved,
                ];

                return Response<List<Guid>>.Success(result);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        #endregion [-- LICENCAFUNCIONALIDADESERVICE - API METHODS --]

        #region [-- LICENCAFUNCIONALIDADESERVICE - INTERNAL METHODS --]

        private async Task<List<Guid>> AddFuncionalidadesAsync(
            Licenca licenca,
            List<Guid> funcionalidadesIds,
            List<string> failureMessages
        )
        {
            List<Guid> funcionalidadesAdded = []; // List to track added functionalities

            foreach (Guid funcionalidadeId in funcionalidadesIds)
            {
                bool associationFuncionalidadeExists =
                    await _licencaFuncionalidadeRepository.RelationshipExistsAsync(
                        licenca.Id,
                        funcionalidadeId
                    );

                if (associationFuncionalidadeExists)
                {
                    continue; // Skip if already associated
                }

                // Retrieve the Funcionalidade by its ID
                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    failureMessages.Add($"Funcionalidade {funcionalidadeId} não encontrada");
                    continue; // Skip if funcionalidade does not exist
                }

                // Check if the Funcionalidade belongs to the same Aplicacao as the Licenca
                if (funcionalidade.Modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    failureMessages.Add(
                        $"Funcionalidade {funcionalidadeId} não pertence à mesma aplicação da licença"
                    );
                    continue; // Skip if not part of the same Aplicacao
                }

                // Check if the relationship already exists (LicencaModulo)
                bool associationModuloExists =
                    await _licencaModuloRepository.RelationshipExistsAsync(
                        licenca.Id,
                        funcionalidade.ModuloId
                    );

                // If the relationship exists, return a failure response
                if (associationModuloExists)
                {
                    failureMessages.Add(
                        $"Módulo da Funcionalidade {funcionalidadeId} não está associado à licença"
                    );
                    continue; // Skip if modulo is not associated
                }

                // Add the new relationship to the repository
                await _licencaFuncionalidadeRepository.AddAsync(licenca.Id, funcionalidadeId);

                // Add to the list of successfully added functionalities
                funcionalidadesAdded.Add(funcionalidadeId);
            }

            return funcionalidadesAdded; // Return the list of successfully added functionalities
        }

        private async Task<(
            List<Guid> modulosAdded,
            List<Guid> funcionalidadesAdded
        )> AddModulosAndFuncionalidadesAsync(
            Licenca licenca,
            List<UpdateModulosFuncionalidadesRequest> funcionalidadesIds,
            List<string> failureMessages
        )
        {
            List<Guid> modulosAdded = []; // List to track added modulos
            List<Guid> funcionalidadesAdded = []; // List to track added funcionalidades

            foreach (UpdateModulosFuncionalidadesRequest request in funcionalidadesIds)
            {
                Guid funcionalidadeId = Guid.Parse(request.FuncionalidadeId!);
                Guid moduloId = Guid.Parse(request.ModuloId!);

                // Check if the Modulo is already associated with the Licenca
                bool associationModuloExists =
                    await _licencaModuloRepository.RelationshipExistsAsync(licenca.Id, moduloId);

                // If the relationship doesn't exist, add the modulo
                if (!associationModuloExists)
                {
                    // If Modulo is not associated, add it to LicencaModulos
                    Modulo modulo = await _repository.GetByIdAsync<Modulo, Guid>(moduloId);
                    if (modulo == null)
                    {
                        failureMessages.Add($"Modulo {moduloId} não encontrado.");
                        continue; // Skip this iteration if Modulo is not found
                    }

                    if (modulo.AplicacaoId != licenca.AplicacaoId)
                    {
                        failureMessages.Add(
                            $"Modulo {moduloId} não pertence à mesma aplicação da licença."
                        );
                        continue; // Skip if not part of the same Aplicacao
                    }

                    // Add the new relationship to the repository
                    await _licencaModuloRepository.AddAsync(licenca.Id, moduloId);
                    modulosAdded.Add(moduloId); // Track the added modulo
                }

                // Retrieve the Funcionalidade by ID
                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    failureMessages.Add($"Funcionalidade {funcionalidadeId} não encontrada.");
                    continue; // Skip if Funcionalidade does not exist
                }

                // Check if the Funcionalidade belongs to the same Aplicacao as the Licenca
                if (funcionalidade.Modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    failureMessages.Add(
                        $"Funcionalidade {funcionalidadeId} não pertence à mesma aplicação da licença."
                    );
                    continue; // Skip if not part of the same Aplicacao
                }

                // Check if the Funcionalidade is already associated with the Licenca
                bool associationFuncionalidadeExists =
                    await _licencaFuncionalidadeRepository.RelationshipExistsAsync(
                        licenca.Id,
                        funcionalidade.Id
                    );

                // If the relationship exists, continue
                if (associationFuncionalidadeExists)
                {
                    continue; // Skip if already associated
                }

                // Create LicencaFuncionalidade association
                await _licencaFuncionalidadeRepository.AddAsync(licenca.Id, funcionalidade.Id);
                funcionalidadesAdded.Add(funcionalidade.Id); // Track the added funcionalidade
            }

            return (modulosAdded, funcionalidadesAdded); // Return both added modulos and funcionalidades
        }

        private async Task<(
            List<Guid> funcionalidadesKept,
            List<Guid> funcionalidadesRemoved
        )> CleanUpAndKeepFuncionalidadesAsync(Licenca licenca, List<Guid> funcionalidadesIds)
        {
            List<Guid> funcionalidadesKept = []; // List to track kept functionalities
            List<Guid> funcionalidadesRemoved = []; // List to track removed functionalities

            // Iterate over the LicencaFuncionalidade collection and process each one
            foreach (LicencaFuncionalidade licencaFuncionalidade in licenca.LicencasFuncionalidades)
            {
                if (funcionalidadesIds.Contains(licencaFuncionalidade.FuncionalidadeId))
                {
                    // If it's in the functionalitiesIds list, keep it
                    funcionalidadesKept.Add(licencaFuncionalidade.FuncionalidadeId);
                }
                else
                {
                    // If it's not in the functionalitiesIds list, remove it
                    await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                        licencaFuncionalidade.LicencaId,
                        licencaFuncionalidade.FuncionalidadeId
                    );
                    funcionalidadesRemoved.Add(licencaFuncionalidade.FuncionalidadeId); // Track removed functionalities
                }
            }

            return (funcionalidadesKept, funcionalidadesRemoved); // Return tuple with kept and removed FuncionalidadeIds
        }

        private async Task<(
            List<Guid> funcionalidadesRemoved,
            List<Guid> modulosRemoved
        )> CleanUpUnusedModulosAndFuncionalidadesAsync(
            Licenca licenca,
            List<UpdateModulosFuncionalidadesRequest> request
        )
        {
            List<Guid> funcionalidadesRemoved = []; // List to hold removed funcionalidades
            List<Guid> modulosRemoved = []; // List to hold removed modulos

            // Step 1: Remove the LicencaFuncionalidade associations that are no longer needed
            List<Guid> funcionalidadesIdsToRemove = request
                .Select(r => Guid.Parse(r.FuncionalidadeId!))
                .ToList();
            List<LicencaFuncionalidade> funcionalidadesToRemove = licenca
                .LicencasFuncionalidades.Where(lf =>
                    !funcionalidadesIdsToRemove.Contains(lf.FuncionalidadeId)
                )
                .ToList();

            foreach (LicencaFuncionalidade licencaFuncionalidade in funcionalidadesToRemove)
            {
                await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                    licencaFuncionalidade.LicencaId,
                    licencaFuncionalidade.FuncionalidadeId
                ); // Remove it from the collection
                funcionalidadesRemoved.Add(licencaFuncionalidade.FuncionalidadeId); // Track removed funcionalidade
            }

            // Step 2: Check if any Modulo has no associated Funcionalidades
            List<LicencaModulo> modulosToRemove = [];

            foreach (LicencaModulo licencaModulo in licenca.LicencasModulos)
            {
                // Check if there are no Funcionalidades associated with this Modulo
                bool isModuloUsed = licenca.LicencasFuncionalidades.Any(lf =>
                    lf.Funcionalidade.ModuloId == licencaModulo.ModuloId
                );

                if (!isModuloUsed)
                {
                    modulosToRemove.Add(licencaModulo); // Mark this Modulo for removal
                }
            }

            // Remove the Modulos that are no longer associated with any Funcionalidade
            foreach (LicencaModulo licencaModulo in modulosToRemove)
            {
                await _licencaModuloRepository.RemoveAsync(
                    licencaModulo.LicencaId,
                    licencaModulo.ModuloId
                ); // Remove it from the collection
                modulosRemoved.Add(licencaModulo.ModuloId); // Track removed modulo
            }

            return (funcionalidadesRemoved, modulosRemoved); // Return the removed lists
        }

        private async Task<List<Guid>> RemoveFuncionalidadesAsync(
            Licenca licenca,
            List<Guid> funcionalidadesIds
        )
        {
            List<Guid> successfullyRemoved = []; // Initialize the list properly

            // Get all the LicencaFuncionalidade objects to be removed (those whose FuncionalidadeId is in funcionalidadesIds)
            List<LicencaFuncionalidade> funcionalidadesToRemove = licenca
                .LicencasFuncionalidades.Where(lf =>
                    funcionalidadesIds.Contains(lf.FuncionalidadeId)
                )
                .ToList();

            // Set of ModuloIds to check for removal later (to avoid multiple async calls)
            HashSet<Guid> moduloIdsToCheck = [];

            // Remove each Funcionalidade from the list
            foreach (LicencaFuncionalidade licencaFuncionalidade in funcionalidadesToRemove)
            {
                await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                    licencaFuncionalidade.LicencaId,
                    licencaFuncionalidade.FuncionalidadeId
                ); // Remove the LicencaFuncionalidade
                successfullyRemoved.Add(licencaFuncionalidade.FuncionalidadeId); // Track the removed FuncionalidadeId

                // Add the ModuloId associated with this Funcionalidade to the check list
                _ = moduloIdsToCheck.Add(licencaFuncionalidade.Funcionalidade.ModuloId);
            }

            // Now check if any ModuloIds are unused (i.e., not associated with any other Funcionalidade)
            foreach (Guid moduloId in moduloIdsToCheck)
            {
                bool isModuloUsed = await _licencaModuloRepository.IsModuloUsedAsync(moduloId); // Check if the Modulo is still used

                // If the Modulo is not used anymore, remove it
                if (!isModuloUsed)
                {
                    await _licencaModuloRepository.RemoveAsync(licenca.Id, moduloId); // Remove the Modulo
                }
            }

            return successfullyRemoved; // Return the list of successfully removed FuncionalidadeIds
        }

        #endregion [-- LICENCAFUNCIONALIDADESERVICE - INTERNAL METHODS --]
    }
}
