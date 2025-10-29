using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AreaService.DTOs;
using GSLP.Application.Services.Application.AreaService.Filters;
using GSLP.Application.Services.Application.AreaService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Application;

// After creating this service:
// -- 1. Create a Area domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Area> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Areas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Application.AreaService
{
    public class AreaService : IAreaService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public AreaService(IRepositoryAsync repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // get full List
        public async Task<Response<IEnumerable<AreaDTO>>> GetAreasAsync(string keyword = "")
        {
            AreaSearchList specification = new(keyword); // ardalis specification
            IEnumerable<AreaDTO> list = await _repository.GetListAsync<Area, AreaDTO, Guid>(
                specification
            ); // full list, entity mapped to dto
            return Response<IEnumerable<AreaDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<AreaDTO>> GetAreasPaginatedAsync(AreaTableFilter filter)
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable

            AreaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification

            PaginatedResponse<AreaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
                Area,
                AreaDTO,
                Guid
            >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Area by Id
        public async Task<Response<AreaDTO>> GetAreaAsync(Guid id)
        {
            try
            {
                AreaDTO dto = await _repository.GetByIdAsync<Area, AreaDTO, Guid>(id);
                return Response<AreaDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<AreaDTO>.Fail(ex.Message);
            }
        }

        // create new Area
        public async Task<Response<Guid>> CreateAreaAsync(CreateAreaRequest request)
        {
            AreaMatchName specification = new(request.Nome); // ardalis specification
            bool AreaExists = await _repository.ExistsAsync<Area, Guid>(specification);
            if (AreaExists)
            {
                return Response<Guid>.Fail("Já existe uma área com o nome fornecido");
            }

            Area newArea = _mapper.Map(request, new Area()); // map dto to domain entity

            try
            {
                Area response = await _repository.CreateAsync<Area, Guid>(newArea); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Area
        public async Task<Response<Guid>> UpdateAreaAsync(UpdateAreaRequest request, Guid id)
        {
            Area AreaInDb = await _repository.GetByIdAsync<Area, Guid>(id); // get existing entity
            if (AreaInDb == null)
            {
                return Response<Guid>.Fail("Não encontrada");
            }

            Area updatedArea = _mapper.Map(request, AreaInDb); // map dto to domain entity

            try
            {
                Area response = await _repository.UpdateAsync<Area, Guid>(updatedArea); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Area
        public async Task<Response<Guid>> DeleteAreaAsync(Guid id)
        {
            try
            {
                AreaAddAllIncludes specification = new();
                // Get the Area with its related entities
                Area area = await _repository.GetByIdAsync(id, specification);

                if (area == null)
                {
                    return Response<Guid>.Fail("Área não encontrada");
                }

                // Check if it has any aplicacao
                if (area.Aplicacoes.Count > 0)
                {
                    return Response<Guid>.Fail(
                        "Não é possível remover a área porque existem aplicações associadas"
                    );
                }

                Area? Area = await _repository.RemoveByIdAsync<Area, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(Area.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteAreasAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        AreaAddAllIncludes specification = new();
                        Area area = await _repository.GetByIdAsync(id, specification);

                        if (area == null)
                        {
                            failureMessages.Add($"Área {id} não encontrada");
                            continue;
                        }

                        // Check if it has any aplicacao
                        if (area.Aplicacoes.Count > 0)
                        {
                            failureMessages.Add(
                                $"Não é possível remover a área {id} porque existem aplicações associadas"
                            );
                            continue;
                        }

                        Area? removedArea = await _repository.RemoveByIdAsync<Area, Guid>(id);
                        if (removedArea != null)
                        {
                            successfullyDeleted.Add(removedArea.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar área {id}: {ex.Message}");
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
    }
}
