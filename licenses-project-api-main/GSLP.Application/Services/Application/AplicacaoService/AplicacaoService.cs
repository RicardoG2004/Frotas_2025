using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Application.AplicacaoService.Filters;
using GSLP.Application.Services.Application.AplicacaoService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

// After creating this service:
// -- 1. Create a Aplicacao domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Aplicacao> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Aplicacoes api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Application.AplicacaoService
{
    public class AplicacaoService : BaseService, IAplicacaoService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public AplicacaoService(IRepositoryAsync repository, IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // get full List
        public async Task<Response<IEnumerable<AplicacaoDTO>>> GetAplicacoesResponseAsync(
            string keyword = ""
        )
        {
            AplicacaoSearchList specification = new(keyword); // ardalis specification
            IEnumerable<AplicacaoDTO> list = await _repository.GetListAsync<
                Aplicacao,
                AplicacaoDTO,
                Guid
            >(specification); // full list, entity mapped to dto
            return Response<IEnumerable<AplicacaoDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<AplicacaoDTO>> GetAplicacoesPaginatedResponseAsync(
            AplicacaoTableFilter filter
        )
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";

            AplicacaoSearchTable specification = new(filter.Filters ?? [], dynamicOrder);

            PaginatedResponse<AplicacaoDTO> pagedResponse =
                await _repository.GetPaginatedResultsAsync<Aplicacao, AplicacaoDTO, Guid>(
                    filter.PageNumber,
                    filter.PageSize,
                    specification
                );

            return pagedResponse;
        }

        // get single Aplicacao by Id
        public async Task<Response<AplicacaoDTO>> GetAplicacaoResponseAsync(Guid id)
        {
            try
            {
                AplicacaoDTO dto = await _repository.GetByIdAsync<Aplicacao, AplicacaoDTO, Guid>(
                    id
                );
                if (dto == null)
                {
                    return Response<AplicacaoDTO>.Fail("Aplicação não encontrada");
                }
                return Response<AplicacaoDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<AplicacaoDTO>.Fail(ex.Message);
            }
        }

        // create new Aplicacao
        public async Task<Response<Guid>> CreateAplicacaoResponseAsync(
            CreateAplicacaoRequest request
        )
        {
            AplicacaoMatchName aplicacaoMatchNome = new(request.Nome);
            bool AplicacaoExists = await _repository.ExistsAsync<Aplicacao, Guid>(
                aplicacaoMatchNome
            );
            if (AplicacaoExists)
            {
                return Response<Guid>.Fail("Já existe uma aplicação com o nome fornecido");
            }

            Aplicacao newAplicacao = _mapper.Map(request, new Aplicacao());
            newAplicacao.Id = await GenerateNextIdAsync(GuidIncrementType.Application);

            try
            {
                Aplicacao response = await _repository.CreateAsync<Aplicacao, Guid>(newAplicacao);
                _ = await _repository.SaveChangesAsync();
                return Response<Guid>.Success(response.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Aplicacao
        public async Task<Response<Guid>> UpdateAplicacaoResponseAsync(
            UpdateAplicacaoRequest request,
            Guid id
        )
        {
            Aplicacao AplicacaoInDb = await _repository.GetByIdAsync<Aplicacao, Guid>(id); // get existing entity
            if (AplicacaoInDb == null)
            {
                return Response<Guid>.Fail("Não encontrada");
            }

            Aplicacao updatedAplicacao = _mapper.Map(request, AplicacaoInDb); // map dto to domain entity

            try
            {
                Aplicacao response = await _repository.UpdateAsync<Aplicacao, Guid>(
                    updatedAplicacao
                ); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Aplicacao
        public async Task<Response<Guid>> DeleteAplicacaoResponseAsync(Guid id)
        {
            try
            {
                AplicacaoAddAllIncludes specification = new();
                // Get the Aplicacao with its related entities
                Aplicacao aplicacao = await _repository.GetByIdAsync(id, specification);

                if (aplicacao == null)
                {
                    return Response<Guid>.Fail("Aplicação não encontrada");
                }

                // Check if there are active licenses
                if (aplicacao.Licencas.Count > 0)
                {
                    return Response<Guid>.Fail(
                        "Não é possível remover a aplicação porque existem licenças associadas"
                    );
                }

                // Remove all related entities
                foreach (Modulo modulo in aplicacao.Modulos.ToList())
                {
                    await RemoveModuloRelationsAsync(modulo);
                }

                // Remove the application
                _ = await _repository.RemoveByIdAsync<Aplicacao, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(aplicacao.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteAplicacoesAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        AplicacaoAddAllIncludes specification = new();
                        Aplicacao aplicacao = await _repository.GetByIdAsync(id, specification);

                        if (aplicacao == null)
                        {
                            failureMessages.Add($"Aplicação {id} não encontrada");
                            continue;
                        }

                        // Check if it has any licencas
                        if (aplicacao.Licencas.Count > 0)
                        {
                            failureMessages.Add(
                                $"Não é possível remover a aplicação {id} porque existem licenças associadas"
                            );
                            continue;
                        }

                        // Remove all related entities
                        foreach (Modulo modulo in aplicacao.Modulos)
                        {
                            await RemoveModuloRelationsAsync(modulo);
                        }

                        Aplicacao? removedAplicacao = await _repository.RemoveByIdAsync<
                            Aplicacao,
                            Guid
                        >(id);
                        if (removedAplicacao != null)
                        {
                            successfullyDeleted.Add(removedAplicacao.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar aplicação {id}: {ex.Message}");
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
