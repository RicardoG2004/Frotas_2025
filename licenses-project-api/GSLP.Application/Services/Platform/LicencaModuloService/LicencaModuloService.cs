using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaModuloService
{
    public class LicencaModuloService : BaseService, ILicencaModuloService
    {
        private readonly IRepositoryAsync _repository;
        private readonly ILicencaModuloRepository _licencaModuloRepository;
        private readonly ILicencaFuncionalidadeRepository _licencaFuncionalidadeRepository;

        public LicencaModuloService(
            IRepositoryAsync repository,
            ILicencaModuloRepository licencaModuloRepository,
            ILicencaFuncionalidadeRepository licencaFuncionalidadeRepository
        )
            : base(repository)
        {
            _repository = repository;
            _licencaModuloRepository = licencaModuloRepository;
            _licencaFuncionalidadeRepository = licencaFuncionalidadeRepository;
        }

        #region [-- LICENCAMODULOSERVICE - API METHODS --]

        // Add Modulo to Licenca
        public async Task<Response<Guid>> AddModuloToLicencaResponseAsync(
            Guid licencaId,
            Guid moduloId
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

                Modulo modulo = await GetModuloByIdAsync(moduloId);
                if (modulo == null)
                {
                    return Response<Guid>.Fail("Modulo não encontrado");
                }

                // Check if the Modulo belongs to the same Aplicacao as the Licenca
                if (modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    return Response<Guid>.Fail(
                        "Este modulo não pertence à mesma aplicação da licença"
                    );
                }

                /// Check if the relationship already exists (LicencaModulo)
                bool associationExists = await _licencaModuloRepository.RelationshipExistsAsync(
                    licencaId,
                    moduloId
                );

                // If the relationship exists, return a failure response
                if (associationExists)
                {
                    return Response<Guid>.Fail(
                        "Este modulo já se encontra associado a esta licenca"
                    );
                }

                // Add the new relationship to the repository
                await _licencaModuloRepository.AddAsync(licencaId, moduloId);

                return Response<Guid>.Success(licenca.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // Add multiple Modulos to Licenca
        public async Task<Response<List<Guid>>> AddModulosToLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
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

                // Use AddModulosAsync to add modulos
                List<Guid> modulosAdded = await AddModulosAsync(
                    licenca,
                    modulosIds,
                    failureMessages
                );

                // If no updates, return "Nada para atualizar"
                if (modulosAdded.Count == 0 && licenca.LicencasModulos.Count == modulosIds.Count)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // If there are any failures, include them in the response message
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(modulosAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // remove Modulo from Licenca
        public async Task<Response<Guid>> RemoveModuloFromLicencaResponseAsync(
            Guid licencaId,
            Guid moduloId
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

                // Retrieve the Modulo from the database
                Modulo modulo = await GetModuloByIdAsync(moduloId);
                if (modulo == null)
                {
                    return Response<Guid>.Fail("Modulo não encontrado");
                }

                // Check if the Modulo belongs to the same Aplicacao as the Licenca
                if (modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    return Response<Guid>.Fail(
                        "Este modulo não pertence à mesma aplicação da licença"
                    );
                }

                // Check if the relationship already exists (LicencaModulo)
                bool associationExists = await _licencaModuloRepository.RelationshipExistsAsync(
                    licencaId,
                    moduloId
                );

                // If the relationship doesn't exists, return a failure response
                if (!associationExists)
                {
                    return Response<Guid>.Fail("Este modulo não está associado a esta licença");
                }

                // Remove the relationship to the repository
                await _licencaModuloRepository.RemoveAsync(licencaId, moduloId);

                return Response<Guid>.Success(licenca.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // remove multiple Modulos from Licenca
        public async Task<Response<List<Guid>>> RemoveModulosFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
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

                // Use RemoveModulosAsync to remove modulos
                List<Guid> modulosRemoved = await RemoveModulosAsync(licenca, modulosIds);

                // If no modulos were removed, return a "Nada para remover" message
                if (modulosRemoved.Count == 0)
                {
                    return Response<List<Guid>>.Fail("Nada para remover");
                }

                return Response<List<Guid>>.Success(modulosRemoved);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // update Modulos from Licenca
        public async Task<Response<List<Guid>>> UpdateModulosFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> modulosIds
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

                // Step 1: Keep the modulos that are in the provided list, remove the rest
                _ = await CleanUpModulosAsync(licenca, modulosIds);

                // Step 2: Add new associations for the provided modulos
                List<Guid> modulosAdded = await AddModulosAsync(
                    licenca,
                    modulosIds,
                    failureMessages
                );

                // Step 3: If no updates, return "Nada para atualizar"
                if (modulosAdded.Count == 0 && licenca.LicencasModulos.Count == modulosIds.Count)
                {
                    return Response<List<Guid>>.Fail("Nada para atualizar");
                }

                // Step 4: Return response with failure messages or success
                if (failureMessages.Count != 0)
                {
                    return Response<List<Guid>>.Fail(failureMessages);
                }

                return Response<List<Guid>>.Success(modulosAdded);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        // get Modulos and Funcionalidades from Licenca
        public async Task<
            Response<LicencaModulosFuncionalidadesDTO>
        > GetModulosFuncionalidadesDTOByLicencaIdResponseAsync(Guid licencaId)
        {
            try
            {
                // Retrieve the Modulos and Fucionalidades from Licenca
                LicencaModulosFuncionalidadesDTO result =
                    await _licencaModuloRepository.GetModulosAndFuncionalidadesDTOByLicencaIdAsync(
                        licencaId
                    );

                if (result == null)
                {
                    // If no Licenca is found for the provided LicencaId, return an error response
                    return Response<LicencaModulosFuncionalidadesDTO>.Fail(
                        "Licença não encontrada para o Id fornecido."
                    );
                }

                // Return the Licenca if found
                return Response<LicencaModulosFuncionalidadesDTO>.Success(result);
            }
            catch (Exception ex)
            {
                // If any error occurs, return a failure response with the exception message
                return Response<LicencaModulosFuncionalidadesDTO>.Fail(ex.Message);
            }
        }

        #endregion [-- LICENCAMODULOSERVICE - API METHODS --]

        #region [-- LICENCAMODULOSERVICE - INTERNAL METHODS --]

        private async Task<List<Guid>> AddModulosAsync(
            Licenca licenca,
            List<Guid> modulosIds,
            List<string> failureMessages
        )
        {
            List<Guid> modulosAdded = [];

            foreach (Guid moduloId in modulosIds)
            {
                // Check if the Modulo is already associated with the Licenca
                bool associationModuloExists =
                    await _licencaModuloRepository.RelationshipExistsAsync(licenca.Id, moduloId);

                if (associationModuloExists)
                {
                    continue; // Skip if already associated
                }

                Modulo modulo = await GetModuloByIdAsync(moduloId);
                if (modulo == null)
                {
                    failureMessages.Add($"Modulo {moduloId} não encontrado.");
                    continue; // Skip if modulo is not found
                }

                // Check if the Modulo belongs to the same Aplicacao as the Licenca
                if (modulo.AplicacaoId != licenca.AplicacaoId)
                {
                    failureMessages.Add(
                        $"Modulo {moduloId} não pertence à mesma aplicação da licença."
                    );
                    continue; // Skip if not part of the same Aplicacao
                }

                // Add the new relationship to the repository
                await _licencaModuloRepository.AddAsync(licenca.Id, moduloId);

                // Add to the list of successfully added modulos
                modulosAdded.Add(moduloId);
            }

            return modulosAdded; // Return only the successfully added modulos
        }

        private async Task<List<Guid>> CleanUpModulosAsync(Licenca licenca, List<Guid> modulosIds)
        {
            List<Guid> modulosKept = []; // List to track successfully kept modulos

            // Remove the LicencaModulo objects that are not in the modulosIds list
            foreach (LicencaModulo licencaModulo in licenca.LicencasModulos.ToList())
            {
                if (!modulosIds.Contains(licencaModulo.ModuloId)) // Remove if not in the list
                {
                    // Remove related LicencaFuncionalidade for this ModuloId
                    List<LicencaFuncionalidade> funcionalidadesToRemove = licenca
                        .LicencasFuncionalidades.Where(lf =>
                            lf.Funcionalidade.ModuloId == licencaModulo.ModuloId
                        )
                        .ToList();

                    foreach (LicencaFuncionalidade licencaFuncionalidade in funcionalidadesToRemove)
                    {
                        await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                            licencaFuncionalidade.LicencaId,
                            licencaFuncionalidade.FuncionalidadeId
                        ); // Remove it from the collection
                    }

                    // Remove the LicencaModulo itself
                    await _licencaModuloRepository.RemoveAsync(
                        licencaModulo.LicencaId,
                        licencaModulo.ModuloId
                    ); // Remove it from the collection
                }
                else
                {
                    // Add the ModuloId to the success list (those that are kept)
                    modulosKept.Add(licencaModulo.ModuloId);
                }
            }

            return modulosKept; // Return list of successfully kept ModuloIds
        }

        private async Task<List<Guid>> RemoveModulosAsync(Licenca licenca, List<Guid> modulosIds)
        {
            List<Guid> modulosRemoved = []; // List to track successfully removed modulos

            List<LicencaModulo> modulosToRemove = licenca
                .LicencasModulos.Where(lm => modulosIds.Contains(lm.ModuloId))
                .ToList();

            foreach (LicencaModulo licencaModulo in modulosToRemove)
            {
                // Remove related LicencaFuncionalidade for this ModuloId
                List<LicencaFuncionalidade> funcionalidadesToRemove = licenca
                    .LicencasFuncionalidades.Where(lf =>
                        lf.Funcionalidade.ModuloId == licencaModulo.ModuloId
                    )
                    .ToList();

                foreach (LicencaFuncionalidade licencaFuncionalidade in funcionalidadesToRemove)
                {
                    await _licencaFuncionalidadeRepository.RemoveLicencaFuncionalidadeWithAssociationsAsync(
                        licencaFuncionalidade.LicencaId,
                        licencaFuncionalidade.FuncionalidadeId
                    ); // Remove it from the collection
                }

                // Remove the LicencaModulo association
                await _licencaModuloRepository.RemoveAsync(
                    licencaModulo.LicencaId,
                    licencaModulo.ModuloId
                ); // Remove it from the collection

                // Add the ModuloId to the success list
                modulosRemoved.Add(licencaModulo.ModuloId);
            }

            return modulosRemoved; // Return list of successfully removed ModuloIds
        }

        #endregion [-- LICENCAMODULOSERVICE - INTERNAL METHODS --]
    }
}
