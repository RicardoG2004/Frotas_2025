using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AplicacaoService.Specifications;
using GSLP.Application.Services.Application.FuncionalidadeService.DTOs;
using GSLP.Application.Services.Application.FuncionalidadeService.Filters;
using GSLP.Application.Services.Application.FuncionalidadeService.Specifications;
using GSLP.Application.Services.Application.ModuloService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

// After creating this service:
// -- 1. Create a Funcionalidade domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Funcionalidade> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Funcionalidades api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Application.FuncionalidadeService
{
    public class FuncionalidadeService : BaseService, IFuncionalidadeService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public FuncionalidadeService(IRepositoryAsync repository, IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // get full List
        public async Task<Response<IEnumerable<FuncionalidadeDTO>>> GetFuncionalidadesResponseAsync(
            string keyword = "",
            Guid? moduloId = null
        )
        {
            FuncionalidadeSearchList specification = new(keyword, moduloId); // ardalis specification
            IEnumerable<FuncionalidadeDTO> list = await _repository.GetListAsync<
                Funcionalidade,
                FuncionalidadeDTO,
                Guid
            >(specification); // full list, entity mapped to dto
            return Response<IEnumerable<FuncionalidadeDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<
            PaginatedResponse<FuncionalidadeDTO>
        > GetFuncionalidadesPaginatedResponseAsync(FuncionalidadeTableFilter filter)
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";

            FuncionalidadeSearchTable specification = new(filter.Filters ?? [], dynamicOrder);

            PaginatedResponse<FuncionalidadeDTO> pagedResponse =
                await _repository.GetPaginatedResultsAsync<Funcionalidade, FuncionalidadeDTO, Guid>(
                    filter.PageNumber,
                    filter.PageSize,
                    specification
                ); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Funcionalidade by Id
        public async Task<Response<FuncionalidadeDTO>> GetFuncionalidadeResponseAsync(Guid id)
        {
            try
            {
                FuncionalidadeDTO dto = await _repository.GetByIdAsync<
                    Funcionalidade,
                    FuncionalidadeDTO,
                    Guid
                >(id);
                if (dto == null)
                {
                    return Response<FuncionalidadeDTO>.Fail("Funcionalidade não encontrada");
                }
                return Response<FuncionalidadeDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<FuncionalidadeDTO>.Fail(ex.Message);
            }
        }

        // create new Funcionalidade
        public async Task<Response<Guid>> CreateFuncionalidadeResponseAsync(
            CreateFuncionalidadeRequest request
        )
        {
            FuncionalidadeMatchName funcionalidadeMatchNome = new(request.Nome); // ardalis specification
            bool FuncionalidadeExists = await _repository.ExistsAsync<Funcionalidade, Guid>(
                funcionalidadeMatchNome
            );
            if (FuncionalidadeExists)
            {
                return Response<Guid>.Fail("Já existe uma funcionalidade com o nome fornecido");
            }

            if (!Guid.TryParse(request.ModuloId, out Guid moduloGuid))
            {
                return Response<Guid>.Fail("O campo ModuloId não é uma Guid válida");
            }

            ModuloMatchId moduloMatchId = new(moduloGuid);
            bool moduloExists = await _repository.ExistsAsync<Modulo, Guid>(moduloMatchId);
            if (!moduloExists)
            {
                return Response<Guid>.Fail("O módulo não foi encontrado");
            }

            Funcionalidade newFuncionalidade = _mapper.Map(request, new Funcionalidade()); // map dto to domain entity
            newFuncionalidade.Id = await GenerateNextIdAsync(GuidIncrementType.Feature, moduloGuid);

            try
            {
                Funcionalidade response = await _repository.CreateAsync<Funcionalidade, Guid>(
                    newFuncionalidade
                ); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Funcionalidade
        public async Task<Response<Guid>> UpdateFuncionalidadeResponseAsync(
            UpdateFuncionalidadeRequest request,
            Guid id
        )
        {
            Funcionalidade FuncionalidadeInDb = await _repository.GetByIdAsync<
                Funcionalidade,
                Guid
            >(id); // get existing entity
            if (FuncionalidadeInDb == null)
            {
                return Response<Guid>.Fail("Not Found");
            }

            Funcionalidade updatedFuncionalidade = _mapper.Map(request, FuncionalidadeInDb); // map dto to domain entity

            try
            {
                Funcionalidade response = await _repository.UpdateAsync<Funcionalidade, Guid>(
                    updatedFuncionalidade
                ); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Funcionalidade
        public async Task<Response<Guid>> DeleteFuncionalidadeResponseAsync(Guid id)
        {
            try
            {
                // Check if funcionalidade exists
                var funcionalidade = await _repository.GetByIdAsync<Funcionalidade, Guid>(id);
                if (funcionalidade == null)
                {
                    return Response<Guid>.Fail("Funcionalidade não encontrada");
                }

                // First delete associated records
                await RemoveFuncionalidadeRelationsAsync(id);

                // Then delete the funcionalidade
                Funcionalidade? removedFuncionalidade = await _repository.RemoveByIdAsync<
                    Funcionalidade,
                    Guid
                >(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(removedFuncionalidade.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteFuncionalidadesAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        // Check if funcionalidade exists
                        var funcionalidade = await _repository.GetByIdAsync<Funcionalidade, Guid>(
                            id
                        );
                        if (funcionalidade == null)
                        {
                            failureMessages.Add($"Funcionalidade {id} não encontrada");
                            continue;
                        }

                        // First delete associated records
                        await RemoveFuncionalidadeRelationsAsync(id);

                        // Then delete the funcionalidade
                        Funcionalidade? removedFuncionalidade = await _repository.RemoveByIdAsync<
                            Funcionalidade,
                            Guid
                        >(id);
                        if (removedFuncionalidade != null)
                        {
                            successfullyDeleted.Add(removedFuncionalidade.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar funcionalidade {id}: {ex.Message}");
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

        // get funcionalidades by aplicacao
        public async Task<
            Response<IEnumerable<FuncionalidadeDTO>>
        > GetFuncionalidadesByAplicacaoResponseAsync(Guid aplicacaoId)
        {
            // First, ensure that the AplicacaoId is valid and the Aplicacao exists
            AplicacaoMatchId aplicacaoMatchId = new(aplicacaoId);
            bool aplicacaoExists = await _repository.ExistsAsync<Aplicacao, Guid>(aplicacaoMatchId);

            if (!aplicacaoExists)
            {
                return Response<IEnumerable<FuncionalidadeDTO>>.Fail("Aplicação não encontrada");
            }

            // Create a specification to fetch all Funcionalidades linked to this Aplicacao
            FuncionalidadeMatchAplicacaoId funcionalidadeMatchAplicacaoId = new(aplicacaoId);

            // Get the list of Funcionalidades for the Aplicacao
            IEnumerable<FuncionalidadeDTO> funcionalidadesList = await _repository.GetListAsync<
                Funcionalidade,
                FuncionalidadeDTO,
                Guid
            >(funcionalidadeMatchAplicacaoId);

            return Response<IEnumerable<FuncionalidadeDTO>>.Success(funcionalidadesList);
        }

        // get funcionalidades by aplicacao
        public async Task<
            Response<IEnumerable<FuncionalidadeDTO>>
        > GetFuncionalidadesByModuloResponseAsync(Guid moduloId)
        {
            // First, ensure that the ModuloId is valid and the Modulo exists
            ModuloMatchId moduloMatchId = new(moduloId);
            bool moduloExists = await _repository.ExistsAsync<Modulo, Guid>(moduloMatchId);

            if (!moduloExists)
            {
                return Response<IEnumerable<FuncionalidadeDTO>>.Fail("Módulo não encontrado");
            }

            // Create a specification to fetch all Funcionalidades linked to this Modulo
            FuncionalidadeMatchModuloId funcionalidadeMatchModuloId = new(moduloId);

            // Get the list of Funcionalidades for the Modulo
            IEnumerable<FuncionalidadeDTO> funcionalidadesList = await _repository.GetListAsync<
                Funcionalidade,
                FuncionalidadeDTO,
                Guid
            >(funcionalidadeMatchModuloId);

            return Response<IEnumerable<FuncionalidadeDTO>>.Success(funcionalidadesList);
        }
    }
}
