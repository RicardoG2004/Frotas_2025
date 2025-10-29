using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RubricaService.DTOs;
using GACloud.API.Application.Services.Base.RubricaService.Filters;
using GACloud.API.Application.Services.Base.RubricaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Rubrica domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Rubrica> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Rubricas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.RubricaService
{
  public class RubricaService(IRepositoryAsync repository, IMapper mapper) : IRubricaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<RubricaDTO>>> GetRubricasAsync(
      string keyword = "",
      string? epocaId = null
    )
    {
      RubricaSearchList specification = new(keyword, epocaId); // ardalis specification
      IEnumerable<RubricaDTO> list = await _repository.GetListAsync<Rubrica, RubricaDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<RubricaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<RubricaDTO>> GetRubricasPaginatedAsync(
      RubricaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      RubricaSearchTable specification = new(filter.Filters ?? [], dynamicOrder, filter.EpocaId); // ardalis specification
      PaginatedResponse<RubricaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Rubrica,
        RubricaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Rubrica by Id
    public async Task<Response<RubricaDTO>> GetRubricaAsync(Guid id)
    {
      try
      {
        RubricaDTO dto = await _repository.GetByIdAsync<Rubrica, RubricaDTO, Guid>(id);
        return Response<RubricaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<RubricaDTO>.Fail(ex.Message);
      }
    }

    // create new Rubrica
    public async Task<Response<Guid>> CreateRubricaAsync(CreateRubricaRequest request)
    {
      RubricaMatchName specification = new(request.Codigo); // ardalis specification
      bool RubricaExists = await _repository.ExistsAsync<Rubrica, Guid>(specification);
      if (RubricaExists)
      {
        return Response<Guid>.Fail("Rubrica already exists");
      }

      Rubrica newRubrica = _mapper.Map(request, new Rubrica()); // map dto to domain entity

      try
      {
        Rubrica response = await _repository.CreateAsync<Rubrica, Guid>(newRubrica); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Rubrica
    public async Task<Response<Guid>> UpdateRubricaAsync(UpdateRubricaRequest request, Guid id)
    {
      Rubrica RubricaInDb = await _repository.GetByIdAsync<Rubrica, Guid>(id); // get existing entity
      if (RubricaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Rubrica updatedRubrica = _mapper.Map(request, RubricaInDb); // map dto to domain entity

      try
      {
        Rubrica response = await _repository.UpdateAsync<Rubrica, Guid>(updatedRubrica); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Rubrica
    public async Task<Response<Guid>> DeleteRubricaAsync(Guid id)
    {
      try
      {
        Rubrica? Rubrica = await _repository.RemoveByIdAsync<Rubrica, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Rubrica.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Rubricas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleRubricasAsync(
      IEnumerable<Guid> ids
    )
    {
      try
      {
        List<Guid> idsList = ids.ToList();
        List<Guid> successfullyDeletedIds = [];
        List<string> failedDeletions = [];

        // Try to delete each ID individually to track partial failures
        foreach (Guid id in idsList)
        {
          try
          {
            // Check if entity exists first
            Rubrica? entity = await _repository.GetByIdAsync<Rubrica, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Rubrica com ID {id}");
              continue;
            }

            // Try to delete the entity
            Rubrica? deletedEntity = await _repository.RemoveByIdAsync<Rubrica, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Rubrica com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Rubrica com ID {id}");

            // Clear the change tracker to reset the context state after a failed deletion
            // This prevents the failed deletion from affecting subsequent operations
            _repository.ClearChangeTracker();
          }
        }

        // Determine response type based on results
        if (successfullyDeletedIds.Count == idsList.Count)
        {
          // All deletions successful
          return Response<IEnumerable<Guid>>.Success(successfullyDeletedIds);
        }
        else if (successfullyDeletedIds.Count > 0)
        {
          // Partial success - some deletions succeeded, some failed
          string message =
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} rubricas.";
          return Response<IEnumerable<Guid>>.PartialSuccess(successfullyDeletedIds, message);
        }
        else
        {
          // All deletions failed
          return Response<IEnumerable<Guid>>.Fail(string.Join("; ", failedDeletions));
        }
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<Guid>>.Fail(ex.Message);
      }
    }
  }
}
