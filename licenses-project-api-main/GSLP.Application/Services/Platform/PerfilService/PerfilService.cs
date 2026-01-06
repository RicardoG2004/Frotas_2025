using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.Filters;
using GSLP.Application.Services.Platform.PerfilService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Platform;

// After creating this service:
// -- 1. Create a Perfil domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Perfil> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Perfis api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Platform.PerfilService
{
    public class PerfilService : IPerfilService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;
        private readonly IHelperService _helperService;

        public PerfilService(
            IRepositoryAsync repository,
            IMapper mapper,
            IHelperService helperService
        )
        {
            _repository = repository;
            _mapper = mapper;
            _helperService = helperService;
        }

        #region [-- PERFILSERVICE - API METHODS --]

        // get full List
        public async Task<Response<IEnumerable<PerfilDTO>>> GetPerfisResponseAsync(
            string keyword = ""
        )
        {
            PerfilSearchList specification = new(keyword); // ardalis specification
            IEnumerable<PerfilDTO> list = await _repository.GetListAsync<Perfil, PerfilDTO, Guid>(
                specification
            ); // full list, entity mapped to dto
            return Response<IEnumerable<PerfilDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<PerfilDTO>> GetPerfisPaginatedResponseAsync(
            PerfilTableFilter filter
        )
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable

            PerfilSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification

            PaginatedResponse<PerfilDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
                Perfil,
                PerfilDTO,
                Guid
            >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Perfil by Id
        public async Task<Response<PerfilDTO>> GetPerfilResponseAsync(Guid id)
        {
            try
            {
                PerfilDTO dto = await _repository.GetByIdAsync<Perfil, PerfilDTO, Guid>(id);
                if (dto == null)
                {
                    return Response<PerfilDTO>.Fail("Perfil não encontrado");
                }
                return Response<PerfilDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<PerfilDTO>.Fail(ex.Message);
            }
        }

        // create new Perfil
        public async Task<Response<Guid>> CreatePerfilResponseAsync(CreatePerfilRequest request)
        {
            PerfilMatchName perfilMatchName = new(request.Nome); // ardalis specification
            bool PerfilExists = await _repository.ExistsAsync<Perfil, Guid>(perfilMatchName);
            if (PerfilExists)
            {
                return Response<Guid>.Fail("Já existe um perfil com o nome fornecido");
            }

            Perfil newPerfil = _mapper.Map(request, new Perfil()); // map dto to domain entity

            try
            {
                Perfil response = await _repository.CreateAsync<Perfil, Guid>(newPerfil); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Perfil
        public async Task<Response<Guid>> UpdatePerfilResponseAsync(
            UpdatePerfilRequest request,
            Guid id
        )
        {
            Perfil PerfilInDb = await _repository.GetByIdAsync<Perfil, Guid>(id); // get existing entity
            if (PerfilInDb == null)
            {
                return Response<Guid>.Fail("Não encontrado");
            }

            Perfil updatedPerfil = _mapper.Map(request, PerfilInDb); // map dto to domain entity

            try
            {
                Perfil response = await _repository.UpdateAsync<Perfil, Guid>(updatedPerfil); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Perfil
        public async Task<Response<Guid>> DeletePerfilResponseAsync(Guid id)
        {
            try
            {
                // Check if perfil exists
                var perfil = await _repository.GetByIdAsync<Perfil, Guid>(id);
                if (perfil == null)
                {
                    return Response<Guid>.Fail("Perfil não encontrado");
                }

                // First delete associated records
                await RemovePerfilRelationsAsync(id);

                // Then delete the perfil
                Perfil? removedPerfil = await _repository.RemoveByIdAsync<Perfil, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(removedPerfil.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeletePerfisAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        // Check if perfil exists
                        var perfil = await _repository.GetByIdAsync<Perfil, Guid>(id);
                        if (perfil == null)
                        {
                            failureMessages.Add($"Perfil {id} não encontrado");
                            continue;
                        }

                        // First delete associated records
                        await RemovePerfilRelationsAsync(id);

                        // Then delete the perfil
                        Perfil? removedPerfil = await _repository.RemoveByIdAsync<Perfil, Guid>(id);
                        if (removedPerfil != null)
                        {
                            successfullyDeleted.Add(removedPerfil.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar perfil {id}: {ex.Message}");
                    }
                }

                _ = await _repository.SaveChangesAsync();

                return failureMessages.Count > 0
                    ? Response<List<Guid>>.Fail(failureMessages)
                    : Response<List<Guid>>.Success(successfullyDeleted);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        private async Task RemovePerfilRelationsAsync(Guid perfilId)
        {
            await _repository.DeleteWhereAsync<PerfilFuncionalidade>(pf => pf.PerfilId == perfilId);
            await _repository.DeleteWhereAsync<PerfilUtilizador>(pu => pu.PerfilId == perfilId);
        }

        public async Task<Response<IEnumerable<PerfilBasicDTO>>> GetPerfisFromLicencaResponseAsync(
            Guid licencaId,
            string keyword = ""
        )
        {
            PerfilSearchListMatchLicencaId specification = new(licencaId, keyword); // ardalis specification
            IEnumerable<PerfilBasicDTO> list = await _repository.GetListAsync<
                Perfil,
                PerfilBasicDTO,
                Guid
            >(specification); // full list, entity mapped to dto
            return Response<IEnumerable<PerfilBasicDTO>>.Success(list);
        }

        public async Task<Response<PerfilBasicDTO>> GetPerfilByIdFromLicencaResponseAsync(
            Guid licencaId,
            Guid id
        )
        {
            try
            {
                PerfilMatchLicencaId perfilMatchLicencaId = new(licencaId);
                PerfilBasicDTO dto = await _repository.GetByIdAsync<Perfil, PerfilBasicDTO, Guid>(
                    id,
                    perfilMatchLicencaId
                );
                if (dto == null)
                {
                    return Response<PerfilBasicDTO>.Fail("Perfil não encontrado");
                }
                return Response<PerfilBasicDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<PerfilBasicDTO>.Fail(ex.Message);
            }
        }

        public async Task<Response<Guid>> CreatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            CreatePerfilBasicRequest request
        )
        {
            PerfilMatchNameLicencaId perfilMatchNameLicencaId = new(request.Nome, licencaId); // ardalis specification
            bool PerfilExists = await _repository.ExistsAsync<Perfil, Guid>(
                perfilMatchNameLicencaId
            );
            if (PerfilExists)
            {
                return Response<Guid>.Fail(
                    "Já existe um perfil com o nome fornecido para esta licença"
                );
            }

            Perfil newPerfil = _mapper.Map(request, new Perfil()); // map dto to domain entity
            newPerfil.LicencaId = licencaId;

            try
            {
                Perfil response = await _repository.CreateAsync<Perfil, Guid>(newPerfil); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<Guid>> UpdatePerfilFromLicencaResponseAsync(
            Guid licencaId,
            UpdatePerfilRequest request,
            Guid id
        )
        {
            // Get existing perfil and verify it belongs to the current licenca
            PerfilMatchLicencaId perfilMatchLicencaId = new(licencaId);
            Perfil perfilInDb = await _repository.GetByIdAsync(id, perfilMatchLicencaId);
            if (perfilInDb == null)
            {
                return Response<Guid>.Fail("Perfil não encontrado para esta licença");
            }

            // Check if new name conflicts with existing perfil (excluding current perfil)
            if (request.Nome != perfilInDb.Nome)
            {
                PerfilMatchNameLicencaId perfilMatchNameLicencaId = new(request.Nome, licencaId);
                bool perfilExists = await _repository.ExistsAsync<Perfil, Guid>(
                    perfilMatchNameLicencaId
                );
                if (perfilExists)
                {
                    return Response<Guid>.Fail(
                        "Já existe um perfil com o nome fornecido para esta licença"
                    );
                }
            }

            Perfil updatedPerfil = _mapper.Map(request, perfilInDb);

            try
            {
                Perfil response = await _repository.UpdateAsync<Perfil, Guid>(updatedPerfil);
                _ = await _repository.SaveChangesAsync();
                return Response<Guid>.Success(response.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<Guid>> DeletePerfilFromLicencaResponseAsync(
            Guid licencaId,
            Guid id
        )
        {
            // Get existing perfil and verify it belongs to the current licenca
            PerfilMatchLicencaId perfilMatchLicencaId = new(licencaId);
            Perfil perfilInDb = await _repository.GetByIdAsync(id, perfilMatchLicencaId);
            if (perfilInDb == null)
            {
                return Response<Guid>.Fail("Perfil não encontrado para esta licença");
            }

            try
            {
                // First delete associated records
                await _repository.DeleteWhereAsync<PerfilFuncionalidade>(pf => pf.PerfilId == id);
                await _repository.DeleteWhereAsync<PerfilUtilizador>(pu => pu.PerfilId == id);

                // Then delete the perfil
                Perfil? removedPerfil = await _repository.RemoveByIdAsync<Perfil, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(removedPerfil.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeletePerfisFromLicencaResponseAsync(
            Guid licencaId,
            List<Guid> ids
        )
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        // Get existing perfil and verify it belongs to the current licenca
                        PerfilMatchLicencaId perfilMatchLicencaId = new(licencaId);
                        Perfil perfilInDb = await _repository.GetByIdAsync(
                            id,
                            perfilMatchLicencaId
                        );
                        if (perfilInDb == null)
                        {
                            failureMessages.Add($"Perfil {id} não encontrado para esta licença");
                            continue;
                        }

                        // First delete associated records
                        await _repository.DeleteWhereAsync<PerfilFuncionalidade>(pf =>
                            pf.PerfilId == id
                        );
                        await _repository.DeleteWhereAsync<PerfilUtilizador>(pu =>
                            pu.PerfilId == id
                        );

                        // Then delete the perfil
                        Perfil? removedPerfil = await _repository.RemoveByIdAsync<Perfil, Guid>(id);
                        if (removedPerfil != null)
                        {
                            successfullyDeleted.Add(removedPerfil.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar perfil {id}: {ex.Message}");
                    }
                }

                _ = await _repository.SaveChangesAsync();

                return failureMessages.Count > 0
                    ? Response<List<Guid>>.Fail(failureMessages)
                    : Response<List<Guid>>.Success(successfullyDeleted);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        #endregion [-- PERFILSERVICE - API METHODS --]

        #region [-- PERFILSERVICE - INTERNAL METHODS --]

        #endregion [-- PERFILSERVICE - INTERNAL METHODS --]

        #region [-- PERFIlSERVICE - PUBLIC METHODS --]

        public async Task<Perfil?> GetPerfilByUtilizadorIdAndLicenseIdAsync(
            string utilizadorId,
            Guid licencaId
        )
        {
            try
            {
                PerfilMatchUtilizadorIdLicencaId perfilMatchUtilizadorIdLicencaId = new(
                    utilizadorId,
                    licencaId
                );
                // Retrieve the Perfil associated with the given UtilizadorId
                IEnumerable<Perfil> perfil = await _repository.GetListAsync<Perfil, Guid>(
                    perfilMatchUtilizadorIdLicencaId
                );

                // If no Perfil is found
                if (perfil == null || !perfil.Any())
                {
                    return null;
                }

                // Get the first associated Perfil (assuming there's only one associated Perfil per UtilizadorId)
                Perfil? perfilToReturn = perfil.FirstOrDefault();

                return perfilToReturn;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<
            PaginatedResponse<PerfilBasicDTO>
        > GetPerfisFromLicencaPaginatedResponseAsync(Guid licencaId, PerfilTableFilter filter)
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";

            // Create specification with licencaId filter
            PerfilSearchTableMatchLicencaId specification = new(
                filter.Filters ?? [],
                dynamicOrder,
                licencaId
            );

            // Get paginated results
            PaginatedResponse<PerfilBasicDTO> pagedResponse =
                await _repository.GetPaginatedResultsAsync<Perfil, PerfilBasicDTO, Guid>(
                    filter.PageNumber,
                    filter.PageSize,
                    specification
                );

            return pagedResponse;
        }

        #endregion [-- PERFIlSERVICE - PUBLIC METHODS --]
    }
}
