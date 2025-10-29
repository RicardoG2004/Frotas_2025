using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaModuloService;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService
{
    public class PerfilFuncionalidadeService : BaseService, IPerfilFuncionalidadeService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;
        private readonly IPerfilFuncionalidadeRepository _perfilFuncionalidadeRepository;
        private readonly IPerfilUtilizadorRepository _perfilUtilizadorRepository;
        private readonly ILicencaModuloRepository _licencaModuloRepository;
        private readonly IHelperService _helperService;

        public PerfilFuncionalidadeService(
            IRepositoryAsync repository,
            IMapper mapper,
            IPerfilFuncionalidadeRepository perfilFuncionalidadeRepository,
            IPerfilUtilizadorRepository perfilUtilizadorRepository,
            IHelperService helperService,
            ILicencaModuloRepository licencaModuloRepository
        )
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
            _perfilFuncionalidadeRepository = perfilFuncionalidadeRepository;
            _perfilUtilizadorRepository = perfilUtilizadorRepository;
            _helperService = helperService;
            _licencaModuloRepository = licencaModuloRepository;
        }

        #region [-- PERFILFUNCIONALIDADESERVICE - API METHODS --]

        // Add Funcionalidade to Perfil
        public async Task<Response<Guid>> AddFuncionalidadeToPerfilResponseAsync(
            Guid perfilId,
            Guid funcionalidadeId,
            PerfilFuncionalidadeOptionsAssociationRequest request
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

                // Retrieve the Funcionalidade entity from the repository
                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    return Response<Guid>.Fail("Funcionalidade não encontrada");
                }

                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    return Response<Guid>.Fail("Licenca não encontrada");
                }

                // Check if the Funcionalidade exists in the Licenca.LicencasFuncionalidades collection
                bool funcionalidadeExistsInLicenca = licenca.LicencasFuncionalidades.Any(lf =>
                    lf.FuncionalidadeId == funcionalidadeId
                );

                if (!funcionalidadeExistsInLicenca)
                {
                    return Response<Guid>.Fail(
                        "Funcionalidade não encontrada para a licença associada"
                    );
                }

                // Check if the relationship already exists (PerfilFuncionalidade)
                bool associationExists =
                    await _perfilFuncionalidadeRepository.RelationshipExistsAsync(
                        perfilId,
                        funcionalidadeId
                    );

                // If the relationship exists, return a failure response
                if (associationExists)
                {
                    return Response<Guid>.Fail("Funcionalidade já se encontra associada ao perfil");
                }

                PerfilFuncionalidadeAssociationRequest associationRequest =
                    new PerfilFuncionalidadeAssociationRequest
                    {
                        FuncionalidadeId = funcionalidadeId.ToString(),
                        AuthVer = request.AuthVer,
                        AuthAdd = request.AuthAdd,
                        AuthChg = request.AuthChg,
                        AuthDel = request.AuthDel,
                        AuthPrt = request.AuthPrt,
                    };

                // Add the new relationship to the repository
                await _perfilFuncionalidadeRepository.AddAsync(perfilId, associationRequest);

                // Return a success response with the perfilId
                return Response<Guid>.Success(perfilId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Add Funcionalidades to Perfil
        public async Task<Response<List<Guid>>> AddFuncionalidadesToPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        )
        {
            List<Guid> funcionalidadesAdded = []; // List to track successfully added funcionalidades
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                // Loop through each request (funcionalidade)
                foreach (PerfilFuncionalidadeAssociationRequest request in funcionalidades)
                {
                    // Parse the FuncionalidadeId and handle any parsing errors
                    if (!Guid.TryParse(request.FuncionalidadeId, out Guid funcionalidadeId))
                    {
                        failureMessages.Add(
                            $"ID de funcionalidade inválido: {request.FuncionalidadeId}"
                        );
                        continue; // Skip to the next item
                    }

                    // Retrieve the Funcionalidade from the database
                    Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(
                        funcionalidadeId
                    );
                    if (funcionalidade == null)
                    {
                        failureMessages.Add(
                            $"Funcionalidade com ID {request.FuncionalidadeId} não encontrada"
                        );
                        continue; // Skip this functionality and move to the next
                    }

                    Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                    if (licenca == null)
                    {
                        failureMessages.Add($"Licenca não encontrada: {perfil.LicencaId}");
                        continue; // Skip to the next item
                    }

                    // Check if the Funcionalidade exists in the Licenca.LicencasFuncionalidades collection
                    bool funcionalidadeExistsInLicenca = licenca.LicencasFuncionalidades.Any(lf =>
                        lf.FuncionalidadeId == funcionalidadeId
                    );

                    if (!funcionalidadeExistsInLicenca)
                    {
                        failureMessages.Add(
                            $"Funcionalidade com ID {request.FuncionalidadeId} não está licenciada"
                        );
                        continue; // Skip to the next item
                    }

                    // Check if the relationship already exists (PerfilFuncionalidade)
                    bool associationExists =
                        await _perfilFuncionalidadeRepository.RelationshipExistsAsync(
                            perfilId,
                            funcionalidadeId
                        );
                    if (associationExists)
                    {
                        failureMessages.Add(
                            $"Funcionalidade {request.FuncionalidadeId} já associada com este perfil"
                        );
                        continue; // Skip to the next item
                    }

                    try
                    {
                        // Add the new relationship to the repository
                        await _perfilFuncionalidadeRepository.AddAsync(perfilId, request);

                        // Track the added Funcionalidade ID
                        funcionalidadesAdded.Add(funcionalidadeId);
                    }
                    catch (Exception ex)
                    {
                        // Handle any exception during the addition
                        failureMessages.Add(
                            $"Erro ao processar funcionalidade com ID {request.FuncionalidadeId}: {ex.Message}"
                        );
                    }
                }

                // If there are failure messages, return them
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Return the successfully added funcionalidades
                return Response<List<Guid>>.Success(funcionalidadesAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // Add or Update Funcionalidades from Perfil
        public async Task<Response<List<Guid>>> AddOrUpdateFuncionalidadesToPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        )
        {
            List<Guid> funcionalidadesAdded = []; // List to track successfully processed functionalities
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                Guid? licencaIdOrNull = await _helperService.GetLicencaIdFromHttpContextAsync();
                if (!licencaIdOrNull.HasValue || licencaIdOrNull.Equals(Guid.Empty))
                {
                    return Response<List<Guid>>.Fail("O campo LicencaId não pode ser nulo");
                }

                Guid licencaId = licencaIdOrNull.Value;

                // Retrieve the Licenca from the database
                Licenca licenca = await GetLicencaByIdAsync(licencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licença não encontrada");
                }

                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                // Loop through each request (funcionalidade)
                foreach (PerfilFuncionalidadeAssociationRequest request in funcionalidades)
                {
                    try
                    {
                        Guid funcionalidadeId = Guid.Parse(request.FuncionalidadeId!);

                        // Retrieve the Funcionalidade from the database
                        Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(
                            funcionalidadeId
                        );
                        if (funcionalidade == null)
                        {
                            failureMessages.Add(
                                $"Funcionalidade com ID {request.FuncionalidadeId} não encontrada"
                            );
                            continue; // Skip this functionality and move to the next
                        }

                        // Check if the Funcionalidade exists in the Licenca.LicencasFuncionalidades collection
                        bool funcionalidadeExistsInLicenca = licenca.LicencasFuncionalidades.Any(
                            lf => lf.FuncionalidadeId == funcionalidadeId
                        );

                        if (!funcionalidadeExistsInLicenca)
                        {
                            failureMessages.Add(
                                $"Funcionalidade com ID {request.FuncionalidadeId} não está licenciada"
                            );
                            continue; // Skip to the next item
                        }

                        // Check if the FuncionalidadeId is in the Licenca.LicencasFuncionalidades
                        bool isFuncionalidadeInLicenca = licenca.LicencasFuncionalidades.Any(lf =>
                            lf.FuncionalidadeId == funcionalidadeId
                        );

                        if (!isFuncionalidadeInLicenca)
                        {
                            failureMessages.Add(
                                $"Funcionalidade com ID {request.FuncionalidadeId} não está presente na Licença."
                            );
                            continue; // Skip this functionality and move to the next
                        }

                        // Check if the relationship already exists (PerfilFuncionalidade)
                        bool associationExists =
                            await _perfilFuncionalidadeRepository.RelationshipExistsAsync(
                                perfilId,
                                funcionalidadeId
                            );

                        // If the relationship exists, update it
                        if (associationExists)
                        {
                            // Update the existing relationship
                            await _perfilFuncionalidadeRepository.UpdateAsync(perfilId, request);
                            funcionalidadesAdded.Add(funcionalidadeId);
                        }
                        else
                        {
                            // Add the new relationship to the repository
                            await _perfilFuncionalidadeRepository.AddAsync(perfilId, request);
                            funcionalidadesAdded.Add(funcionalidadeId);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add(
                            $"Erro ao processar funcionalidade com ID {request.FuncionalidadeId}: {ex.Message}"
                        );
                        continue; // Skip this functionality and move to the next
                    }
                }

                // Return the result based on whether there were successes or failures
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(funcionalidadesAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // Remove Funcionalidade from Perfil
        public async Task<Response<Guid>> RemoveFuncionalidadeFromPerfilResponseAsync(
            Guid perfilId,
            Guid funcionalidadeId
        )
        {
            try
            {
                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<Guid>.Fail("Perfil não encontrado");
                }

                // Retrieve the Funcionalidade from the database
                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    return Response<Guid>.Fail("Funcionalidade não encontrada");
                }

                // Check if the relationship already exists (PerfilFuncionalidade)
                bool associationExists =
                    await _perfilFuncionalidadeRepository.RelationshipExistsAsync(
                        perfilId,
                        funcionalidadeId
                    );

                // If the relationship doesn't exists, return a failure response
                if (!associationExists)
                {
                    return Response<Guid>.Fail(
                        "Esta funcionalidade não está associada a este perfil"
                    );
                }

                // Remove the relationship to the repository
                await _perfilFuncionalidadeRepository.RemoveAsync(perfilId, funcionalidadeId);

                return Response<Guid>.Success(perfilId);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Remove Funcionalidades from Perfil
        public async Task<Response<List<Guid>>> RemoveFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<Guid> funcionalidadesIds
        )
        {
            List<string> failureMessages = []; // List to track failure messages

            try
            {
                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                // Step 1: Remove associations for funcionalidades that are no longer in the list
                List<Guid> funcionalidadesRemoved = await RemoveFuncionalidadesAsync(
                    perfil,
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

        // Update Funcionalidades from Perfil
        public async Task<Response<List<Guid>>> UpdateFuncionalidadesFromPerfilResponseAsync(
            Guid perfilId,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades
        )
        {
            List<string> failureMessages = [];

            try
            {
                // Retrieve the Perfil from the database
                Perfil perfil = await GetPerfilByIdAsync(perfilId);
                if (perfil == null)
                {
                    return Response<List<Guid>>.Fail("Perfil não encontrado");
                }

                // Retrieve the Licenca associated with the Perfil
                Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
                if (licenca == null)
                {
                    return Response<List<Guid>>.Fail("Licenca não encontrada");
                }

                // Step 1: Extract only valid FuncionalidadeIds that belong to the Licenca
                List<Guid> funcionalidadesIds = GetLicencaValidFuncionalidadeIds(
                    funcionalidades,
                    licenca
                );

                // Step 2: Filter funcionalidades based on valid IDs
                // Filter out any functionalities that do not belong to the valid list of IDs
                List<PerfilFuncionalidadeAssociationRequest> validFuncionalidades = funcionalidades
                    .Where(f => funcionalidadesIds.Contains(Guid.Parse(f.FuncionalidadeId!)))
                    .ToList();

                // Step 3: Track invalid funcionalidades that do not belong to the Licenca
                List<PerfilFuncionalidadeAssociationRequest> invalidFuncionalidades =
                    funcionalidades
                        .Where(f => !funcionalidadesIds.Contains(Guid.Parse(f.FuncionalidadeId!)))
                        .ToList();

                // Add failure messages for invalid funcionalidades
                if (invalidFuncionalidades.Count != 0)
                {
                    failureMessages.Add(
                        "As seguintes funcionalidades não pertencem à licença: "
                            + string.Join(
                                ", ",
                                invalidFuncionalidades.Select(f => f.FuncionalidadeId)
                            )
                    );
                }

                // Step 4: Keep the funcionalidades that are in the provided list, remove the rest
                (List<Guid> funcionalidadesKept, List<Guid> funcionalidadesRemoved) =
                    await CleanUpFuncionalidadesAsync(perfil, funcionalidadesIds);

                // Step 5: Add or update funcionalidades
                (List<Guid> funcionalidadesAdded, List<Guid> funcionalidadesUpdated) =
                    await AddOrUpdateFuncionalidadesAsync(
                        perfil,
                        validFuncionalidades,
                        failureMessages
                    );

                // Step 6: Check if there were any updates (additions, removals, or failures)
                bool hasUpdates =
                    funcionalidadesAdded.Count > 0
                    || funcionalidadesUpdated.Count > 0
                    || funcionalidadesRemoved.Count > 0
                    || failureMessages.Count > 0;

                // If no updates (no additions, no removals, no failures), return "Nada para atualizar"
                if (!hasUpdates)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // Return the result with added and removed functionalities and any failures
                if (failureMessages.Count > 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                // Step 7: Return the response with added, updated, and removed functionalities
                List<Guid> result =
                [
                    .. funcionalidadesAdded,
                    .. funcionalidadesUpdated,
                    .. funcionalidadesRemoved,
                ];

                return Response<List<Guid>>.Success(result);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        public async Task<
            Response<IEnumerable<PerfilFuncionalidadeDTO>>
        > GetPerfilFuncionalidadesDTOByPerfilIdResponseAsync(Guid perfilId)
        {
            try
            {
                IEnumerable<PerfilFuncionalidadeDTO> list =
                    await _perfilFuncionalidadeRepository.GetPerfilFuncionalidadesDTOByPerfilIdAsync(
                        perfilId
                    );

                return Response<IEnumerable<PerfilFuncionalidadeDTO>>.Success(list);
            }
            catch (Exception ex)
            {
                // If any error occurs, return a failure response with the exception message
                return Response<IEnumerable<PerfilFuncionalidadeDTO>>.Fail(ex.Message);
            }
        }

        public async Task<
            Response<PerfilModulosFuncionalidadesTreeDTO>
        > GetModulosFuncionalidadesTreeByPerfilIdResponseAsync(Guid perfilId)
        {
            try
            {
                PerfilModulosFuncionalidadesTreeDTO list =
                    await GetModulosAndFuncionalidadesByPerfilIdAsync(perfilId);

                return Response<PerfilModulosFuncionalidadesTreeDTO>.Success(list);
            }
            catch (Exception ex)
            {
                // If any error occurs, return a failure response with the exception message
                return Response<PerfilModulosFuncionalidadesTreeDTO>.Fail(ex.Message);
            }
        }

        // This method will retrieve the permissions (bitmask) for a specific Perfil
        public async Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByPerfilIdAsync(
            Guid perfilId
        )
        {
            // Get the list of functionalities for the given perfilId
            Dictionary<string, int> funcionalidades =
                await _perfilFuncionalidadeRepository.GetPerfilPermissionsBitmaskByPerfilIdAsync(
                    perfilId
                );

            // Return the dictionary directly
            return funcionalidades;
        }

        // This method will retrieve the permissions (bitmask) for a specific Perfil by UtilizadorId
        public async Task<Dictionary<string, int>> GetPerfilPermissionsBitmaskByUtilizadorIdAsync(
            string utilizadorId
        )
        {
            IEnumerable<PerfilDTO> existingPerfis =
                await _perfilUtilizadorRepository.GetPerfisByUtilizadorIdAsync(utilizadorId);

            // Check if there are no Perfis (i.e., the collection is empty)
            if (!existingPerfis.Any())
            {
                throw new InvalidOperationException(
                    $"Nenhum Perfil encontrado para o UtilizadorId: {utilizadorId}"
                );
            }

            // Check if there are any Perfis, and select the first one if available
            PerfilDTO? perfil = existingPerfis.FirstOrDefault();
            if (perfil == null)
            {
                throw new InvalidOperationException(
                    $"O perfil associado não foi encontrado para o UtilizadorId: {utilizadorId}"
                );
            }

            // Get the list of functionalities for the given perfilId
            Dictionary<string, int> funcionalidades =
                await _perfilFuncionalidadeRepository.GetPerfilPermissionsBitmaskByPerfilIdAsync(
                    Guid.Parse(perfil.Id!)
                );

            // Return the dictionary directly
            return funcionalidades;
        }

        #endregion [-- PERFILFUNCIONALIDADESERVICE - API METHODS --]

        #region [-- PERFILFUNCIONALIDADESERVICE INTERNAL METHODS --]

        private async Task<(
            List<Guid> funcionalidadesAdded,
            List<Guid> funcionalidadesUpdated
        )> AddOrUpdateFuncionalidadesAsync(
            Perfil perfil,
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades,
            List<string> failureMessages
        )
        {
            List<Guid> funcionalidadesAdded = [];
            List<Guid> funcionalidadesUpdated = [];

            foreach (PerfilFuncionalidadeAssociationRequest perfilFuncionalidade in funcionalidades)
            {
                Guid funcionalidadeId = Guid.Parse(perfilFuncionalidade.FuncionalidadeId!);

                // Retrieve the Funcionalidade by ID
                Funcionalidade funcionalidade = await GetFuncionalidadeByIdAsync(funcionalidadeId);
                if (funcionalidade == null)
                {
                    failureMessages.Add($"Funcionalidade {funcionalidadeId} não encontrada.");
                    continue; // Skip if Funcionalidade does not exist
                }

                // Check if the Funcionalidade is already associated with the Perfil
                bool associationFuncionalidadeExists =
                    await _perfilFuncionalidadeRepository.RelationshipExistsAsync(
                        perfil.Id,
                        funcionalidade.Id
                    );

                if (associationFuncionalidadeExists)
                {
                    // If the relationship exists, update it
                    await _perfilFuncionalidadeRepository.UpdateAsync(
                        perfil.Id,
                        perfilFuncionalidade
                    );
                    funcionalidadesUpdated.Add(funcionalidade.Id); // Track updated functionalities
                }
                else
                {
                    // If the relationship doesn't exist, add the new association
                    await _perfilFuncionalidadeRepository.AddAsync(perfil.Id, perfilFuncionalidade);
                    funcionalidadesAdded.Add(funcionalidade.Id); // Track added functionalities
                }
            }

            return (funcionalidadesAdded, funcionalidadesUpdated);
        }

        private async Task<(
            List<Guid> funcionalidadesKept,
            List<Guid> funcionalidadesRemoved
        )> CleanUpFuncionalidadesAsync(Perfil perfil, List<Guid> funcionalidadesIds)
        {
            List<Guid> funcionalidadesKept = []; // List to track kept functionalities
            List<Guid> funcionalidadesRemoved = []; // List to track removed functionalities

            // Convert funcionalidadesIds to a HashSet for faster lookup
            HashSet<Guid> funcionalidadesIdsSet = new(funcionalidadesIds);

            // Create a list of PerfilFuncionalidade objects to remove (those not in funcionalidadesIds)
            List<PerfilFuncionalidade> funcionalidadesToRemove = [];

            // Retrieve the Licenca associated with the Perfil
            Licenca licenca = await GetLicencaByIdAsync(perfil.LicencaId);
            if (licenca == null)
            {
                return (funcionalidadesKept, funcionalidadesRemoved); // If Licenca is not found, just return the lists (no changes).
            }

            foreach (PerfilFuncionalidade perfilFuncionalidade in perfil.PerfisFuncionalidades)
            {
                if (funcionalidadesIdsSet.Contains(perfilFuncionalidade.FuncionalidadeId))
                {
                    // If the Funcionalidade is kept, add to the successfullyKept list
                    funcionalidadesKept.Add(perfilFuncionalidade.FuncionalidadeId);
                }
                else
                {
                    // If the Funcionalidade is not kept, mark it for removal
                    funcionalidadesToRemove.Add(perfilFuncionalidade);
                }
            }

            // Remove the unwanted functionalities and track them as removed
            foreach (PerfilFuncionalidade perfilFuncionalidade in funcionalidadesToRemove)
            {
                await _perfilFuncionalidadeRepository.RemoveAsync(
                    perfilFuncionalidade.PerfilId,
                    perfilFuncionalidade.FuncionalidadeId
                );
                funcionalidadesRemoved.Add(perfilFuncionalidade.FuncionalidadeId); // Track the removed FuncionalidadeId
            }

            return (funcionalidadesKept, funcionalidadesRemoved); // Return tuple with both kept and removed FuncionalidadeIds
        }

        // Generic method to get any permission for a Funcionalidade from PerfilFuncionalidade
        private static bool GetAuthPermission(
            Guid funcionalidadeId,
            Guid perfilId,
            List<PerfilFuncionalidade> perfilFuncionalidades,
            Func<PerfilFuncionalidade, bool> permissionSelector
        )
        {
            return perfilFuncionalidades
                .Where(pf => pf.PerfilId == perfilId && pf.FuncionalidadeId == funcionalidadeId)
                .Any(permissionSelector);
        }

        private static List<Guid> GetLicencaValidFuncionalidadeIds(
            List<PerfilFuncionalidadeAssociationRequest> funcionalidades,
            Licenca licenca
        )
        {
            // Convert the Licenca.LicencasFuncionalidades into a HashSet for faster lookup
            HashSet<Guid> licencaFuncionalidadesIds = new(
                licenca.LicencasFuncionalidades.Select(lf => lf.FuncionalidadeId)
            );

            // Extract only the valid FuncionalidadeIds that belong to the Licenca
            return funcionalidades
                .Where(f =>
                    !string.IsNullOrEmpty(f.FuncionalidadeId)
                    && Guid.TryParse(f.FuncionalidadeId, out _)
                ) // Ensure valid GUIDs
                .Select(f => Guid.Parse(f.FuncionalidadeId!)) // Convert the valid string IDs to GUIDs
                .Where(licencaFuncionalidadesIds.Contains) // Filter out FuncionalidadeIds not in Licenca
                .ToList(); // Convert to List<Guid>
        }

        // Helper method to calculate Estado for Funcionalidade
        private static int GetFuncionalidadeEstado(
            Funcionalidade funcionalidade,
            Guid perfilId,
            List<PerfilFuncionalidade> perfilFuncionalidades
        )
        {
            PerfilFuncionalidade? perfilFuncionalidade = perfilFuncionalidades.FirstOrDefault(pf =>
                pf.PerfilId == perfilId && pf.FuncionalidadeId == funcionalidade.Id
            );

            if (perfilFuncionalidade == null)
                return 0; // Not licensed

            // Check the auth properties to determine the estado
            bool[] authProps =
            [
                perfilFuncionalidade.AuthVer,
                perfilFuncionalidade.AuthAdd,
                perfilFuncionalidade.AuthChg,
                perfilFuncionalidade.AuthDel,
                perfilFuncionalidade.AuthPrt,
            ];

            if (authProps.All(auth => auth))
                return 2; // All permissions granted
            if (authProps.Any(auth => auth))
                return 1; // Some permissions granted
            return 0; // No permissions granted
        }

        // Helper method to calculate Estado for Modulo based on its funcionalidades
        private static int GetModuloEstado(
            Modulo modulo,
            Guid perfilId,
            List<PerfilFuncionalidade> perfilFuncionalidades
        )
        {
            // Get all functionalities' Estado for the given modulo
            List<int> funcionalidadeEstados = modulo
                .Funcionalidades.Select(f =>
                    GetFuncionalidadeEstado(f, perfilId, perfilFuncionalidades)
                )
                .ToList();

            // Determine the modulo's Estado
            if (funcionalidadeEstados.All(e => e == 2))
                return 2; // All funcionalidades licensed
            if (funcionalidadeEstados.Any(e => e == 1))
                return 1; // Some funcionalidades licensed
            return 0; // No funcionalidades licensed
        }

        private async Task<List<Guid>> RemoveFuncionalidadesAsync(
            Perfil perfil,
            List<Guid> funcionalidadesIds
        )
        {
            List<Guid> funcionalidadesRemoved = []; // Initialize the list properly

            // Filter to find the PerfilFuncionalidade objects that need to be removed
            List<PerfilFuncionalidade> funcionalidadesToRemove = perfil
                .PerfisFuncionalidades.Where(lf => funcionalidadesIds.Contains(lf.FuncionalidadeId)) // Find items to remove
                .ToList();

            // Remove each functionality from the list
            foreach (PerfilFuncionalidade perfilFuncionalidade in funcionalidadesToRemove)
            {
                await _perfilFuncionalidadeRepository.RemoveAsync(
                    perfilFuncionalidade.PerfilId,
                    perfilFuncionalidade.FuncionalidadeId
                ); // Remove it from the collection

                // Add the removed FuncionalidadeId to the success list
                funcionalidadesRemoved.Add(perfilFuncionalidade.FuncionalidadeId);
            }

            return funcionalidadesRemoved; // Return the list of successfully removed FuncionalidadeIds
        }

        #endregion [-- PERFILFUNCIONALIDADESERVICE INTERNAL METHODS --]

        #region [-- PERFILFUNCIONALIDADESERVICE - PUBLIC METHODS --]

        // Get all Modulos and Funcionalidades for a specific Perfil
        public async Task<PerfilModulosFuncionalidadesTreeDTO> GetModulosAndFuncionalidadesByPerfilIdAsync(
            Guid perfilId
        )
        {
            // Step 1: Get all modulos and funcionalidades, plus all perfilfuncionalidades in one go
            List<LicencaModulo> modulosWithFuncionalidades =
                await _licencaModuloRepository.GetLicencaModulosByPerfilIdAsync(perfilId);

            List<PerfilFuncionalidade> perfilFuncionalidades =
                await _perfilFuncionalidadeRepository.GetPerfilFuncionalidadesByPerfilIdAsync(
                    perfilId
                );

            // Step 2: Map the data to DTOs
            List<PerfilModuloTreeDTO> modulosDto = modulosWithFuncionalidades
                .Select(lm => new PerfilModuloTreeDTO
                {
                    ModuloId = lm.Modulo.Id.ToString(),
                    ModuloNome = lm.Modulo.Nome,
                    Funcionalidades = lm
                        .Modulo.Funcionalidades.Select(f => new PerfilFuncionalidadeTreeDTO
                        {
                            FuncionalidadeId = f.Id.ToString(),
                            FuncionalidadeNome = f.Nome,
                            Estado = GetFuncionalidadeEstado(f, perfilId, perfilFuncionalidades), // Calculate Estado for Funcionalidade
                            AuthVer = GetAuthPermission(
                                f.Id,
                                perfilId,
                                perfilFuncionalidades,
                                pf => pf.AuthVer
                            ),
                            AuthAdd = GetAuthPermission(
                                f.Id,
                                perfilId,
                                perfilFuncionalidades,
                                pf => pf.AuthAdd
                            ),
                            AuthChg = GetAuthPermission(
                                f.Id,
                                perfilId,
                                perfilFuncionalidades,
                                pf => pf.AuthChg
                            ),
                            AuthDel = GetAuthPermission(
                                f.Id,
                                perfilId,
                                perfilFuncionalidades,
                                pf => pf.AuthDel
                            ),
                            AuthPrt = GetAuthPermission(
                                f.Id,
                                perfilId,
                                perfilFuncionalidades,
                                pf => pf.AuthPrt
                            ),
                        })
                        .ToList(),
                    Estado = GetModuloEstado(lm.Modulo, perfilId, perfilFuncionalidades), // Calculate Estado for Modulo
                })
                .ToList();

            // Step 3: Return the result
            return new PerfilModulosFuncionalidadesTreeDTO { Modulos = modulosDto };
        }

        #endregion [-- PERFILFUNCIONALIDADESERVICE - PUBLIC METHODS --]
    }
}
