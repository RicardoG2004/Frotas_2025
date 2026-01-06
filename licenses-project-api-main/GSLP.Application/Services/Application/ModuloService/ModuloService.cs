using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AplicacaoService.Specifications;
using GSLP.Application.Services.Application.ModuloService.DTOs;
using GSLP.Application.Services.Application.ModuloService.Filters;
using GSLP.Application.Services.Application.ModuloService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

// After creating this service:
// -- 1. Create a Modulo domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Modulo> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Modulos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Application.ModuloService
{
    public class ModuloService : BaseService, IModuloService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public ModuloService(IRepositoryAsync repository, IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // get full List
        public async Task<Response<IEnumerable<ModuloDTO>>> GetModulosResponseAsync(
            string keyword = "",
            Guid? aplicacaoId = null
        )
        {
            ModuloSearchList specification = new(keyword, aplicacaoId); // ardalis specification
            IEnumerable<ModuloDTO> list = await _repository.GetListAsync<Modulo, ModuloDTO, Guid>(
                specification
            ); // full list, entity mapped to dto
            return Response<IEnumerable<ModuloDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<ModuloDTO>> GetModulosPaginatedResponseAsync(
            ModuloTableFilter filter
        )
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";

            ModuloSearchTable specification = new(filter.Filters ?? [], dynamicOrder);

            PaginatedResponse<ModuloDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
                Modulo,
                ModuloDTO,
                Guid
            >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Modulo by Id
        public async Task<Response<ModuloDTO>> GetModuloResponseAsync(Guid id)
        {
            try
            {
                ModuloDTO dto = await _repository.GetByIdAsync<Modulo, ModuloDTO, Guid>(id);
                if (dto == null)
                {
                    return Response<ModuloDTO>.Fail("Modulo não encontrado");
                }
                return Response<ModuloDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<ModuloDTO>.Fail(ex.Message);
            }
        }

        // create new Modulo
        public async Task<Response<Guid>> CreateModuloResponseAsync(CreateModuloRequest request)
        {
            if (!Guid.TryParse(request.AplicacaoId, out Guid aplicacaoGuid))
            {
                return Response<Guid>.Fail("O campo AplicacaoId não é uma Guid válida");
            }

            AplicacaoMatchId aplicacaoMatchId = new(aplicacaoGuid);
            bool aplicacaoExists = await _repository.ExistsAsync<Aplicacao, Guid>(aplicacaoMatchId);
            if (!aplicacaoExists)
            {
                return Response<Guid>.Fail("A aplicação não foi encontrada");
            }

            ModuloMatchNameAndAplicacaoId moduloMatchNameAndAplicacaoId = new(request.Nome, aplicacaoGuid); // ardalis specification
            bool ModuloExists = await _repository.ExistsAsync<Modulo, Guid>(moduloMatchNameAndAplicacaoId);
            if (ModuloExists)
            {
                return Response<Guid>.Fail("Já existe um módulo com o nome fornecido para esta aplicação");
            }

            Modulo newModulo = _mapper.Map(request, new Modulo()); // map dto to domain entity
            newModulo.Id = await GenerateNextIdAsync(GuidIncrementType.Module, aplicacaoGuid);

            try
            {
                Modulo response = await _repository.CreateAsync<Modulo, Guid>(newModulo); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Modulo
        public async Task<Response<Guid>> UpdateModuloResponseAsync(
            UpdateModuloRequest request,
            Guid id
        )
        {
            Modulo ModuloInDb = await _repository.GetByIdAsync<Modulo, Guid>(id); // get existing entity
            if (ModuloInDb == null)
            {
                return Response<Guid>.Fail("Não encontrado");
            }

            if (!Guid.TryParse(request.AplicacaoId, out Guid aplicacaoGuid))
            {
                return Response<Guid>.Fail("O campo AplicacaoId não é uma Guid válida");
            }

            // Check if another module with the same name exists in the same aplicacao (excluding current module)
            ModuloMatchNameAndAplicacaoIdExcludingId moduloMatchNameAndAplicacaoIdExcludingId = new(request.Nome, aplicacaoGuid, id);
            bool ModuloExists = await _repository.ExistsAsync<Modulo, Guid>(moduloMatchNameAndAplicacaoIdExcludingId);
            if (ModuloExists)
            {
                return Response<Guid>.Fail("Já existe um módulo com o nome fornecido para esta aplicação");
            }

            Modulo updatedModulo = _mapper.Map(request, ModuloInDb); // map dto to domain entity

            try
            {
                Modulo response = await _repository.UpdateAsync<Modulo, Guid>(updatedModulo); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Modulo
        public async Task<Response<Guid>> DeleteModuloResponseAsync(Guid id)
        {
            try
            {
                ModuloAddAllIncludes specification = new();
                Modulo modulo = await _repository.GetByIdAsync(id, specification);

                if (modulo == null)
                {
                    return Response<Guid>.Fail("Módulo não encontrado");
                }

                if (modulo.LicencasModulos.Count > 0)
                {
                    return Response<Guid>.Fail("Módulo possui licenças associadas");
                }

                // Remove all related entities
                await RemoveModuloRelationsAsync(modulo);

                Modulo? Modulo = await _repository.RemoveByIdAsync<Modulo, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(Modulo.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteModulosAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        ModuloAddAllIncludes specification = new();
                        Modulo modulo = await _repository.GetByIdAsync(id, specification);

                        if (modulo == null)
                        {
                            failureMessages.Add($"Módulo {id} não encontrado");
                            continue;
                        }

                        // Check if it has any licencas
                        if (modulo.LicencasModulos.Count > 0)
                        {
                            failureMessages.Add(
                                $"Não é possível remover o módulo {id} porque existem licenças associadas"
                            );
                            continue;
                        }

                        // Remove all related entities
                        foreach (Funcionalidade funcionalidade in modulo.Funcionalidades)
                        {
                            await RemoveFuncionalidadeRelationsAsync(funcionalidade.Id);
                        }

                        // Remove the module
                        Modulo? removedModulo = await _repository.RemoveByIdAsync<Modulo, Guid>(id);
                        if (removedModulo != null)
                        {
                            successfullyDeleted.Add(removedModulo.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar módulo {id}: {ex.Message}");
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

        // remove Modulo relations
        private async Task RemoveModuloRelationsAsync(Modulo modulo)
        {
            // Remove Funcionalidade relations first
            foreach (Funcionalidade funcionalidade in modulo.Funcionalidades)
            {
                await RemoveFuncionalidadeRelationsAsync(funcionalidade.Id);
            }

            // Remove Funcionalidades
            await _repository.DeleteWhereAsync<Funcionalidade>(f => f.ModuloId == modulo.Id);

            // Remove LicencaModulo relations
            await RemoveLicencaModuloRelationsAsync(modulo.Id);

            // Remove the Modulo itself
            _ = await _repository.RemoveByIdAsync<Modulo, Guid>(modulo.Id);
        }

        // remove Funcionalidade relations
        private async Task RemoveFuncionalidadeRelationsAsync(Guid funcionalidadeId)
        {
            // Remove PerfilFuncionalidade relations
            await _repository.DeleteWhereAsync<PerfilFuncionalidade>(pf =>
                pf.FuncionalidadeId == funcionalidadeId
            );

            // Remove LicencaFuncionalidade relations
            await _repository.DeleteWhereAsync<LicencaFuncionalidade>(lf =>
                lf.FuncionalidadeId == funcionalidadeId
            );
        }

        // remove LicencaModulo relations
        private async Task RemoveLicencaModuloRelationsAsync(Guid moduloId)
        {
            await _repository.DeleteWhereAsync<LicencaModulo>(lm => lm.ModuloId == moduloId);
        }
    }
}
