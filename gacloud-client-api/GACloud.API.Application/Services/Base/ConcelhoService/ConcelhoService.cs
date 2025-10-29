using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.ConcelhoService.DTOs;
using GACloud.API.Application.Services.Base.ConcelhoService.Filters;
using GACloud.API.Application.Services.Base.ConcelhoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Concelho domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Concelho> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Concelhos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.ConcelhoService
{
  public class ConcelhoService(IRepositoryAsync repository, IMapper mapper) : IConcelhoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ConcelhoDTO>>> GetConcelhosAsync(string keyword = "")
    {
      ConcelhoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ConcelhoDTO> list = await _repository.GetListAsync<Concelho, ConcelhoDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<ConcelhoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ConcelhoDTO>> GetConcelhosPaginatedAsync(
      ConcelhoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ConcelhoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ConcelhoDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Concelho,
        ConcelhoDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Concelho by Id
    public async Task<Response<ConcelhoDTO>> GetConcelhoAsync(Guid id)
    {
      try
      {
        ConcelhoDTO dto = await _repository.GetByIdAsync<Concelho, ConcelhoDTO, Guid>(id);
        return Response<ConcelhoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ConcelhoDTO>.Fail(ex.Message);
      }
    }

    // create new Concelho
    public async Task<Response<Guid>> CreateConcelhoAsync(CreateConcelhoRequest request)
    {
      // First check if distrito exists
      try
      {
        _ = await _repository.GetByIdAsync<Distrito, Guid>(Guid.Parse(request.DistritoId));
      }
      catch (Exception)
      {
        return Response<Guid>.Fail("O distrito não foi encontrado");
      }

      // Then check if concelho name already exists
      ConcelhoMatchName specification = new(request.Nome);
      bool ConcelhoExists = await _repository.ExistsAsync<Concelho, Guid>(specification);
      if (ConcelhoExists)
      {
        return Response<Guid>.Fail("Já existe um concelho com o nome especificado");
      }

      Concelho newConcelho = _mapper.Map(request, new Concelho());

      try
      {
        Concelho response = await _repository.CreateAsync<Concelho, Guid>(newConcelho);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Concelho
    public async Task<Response<Guid>> UpdateConcelhoAsync(UpdateConcelhoRequest request, Guid id)
    {
      Concelho ConcelhoInDb = await _repository.GetByIdAsync<Concelho, Guid>(id); // get existing entity
      if (ConcelhoInDb == null)
      {
        return Response<Guid>.Fail("Concelho não encontrado");
      }

      Concelho updatedConcelho = _mapper.Map(request, ConcelhoInDb); // map dto to domain entity

      try
      {
        Concelho response = await _repository.UpdateAsync<Concelho, Guid>(updatedConcelho); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Concelho
    public async Task<Response<Guid>> DeleteConcelhoAsync(Guid id)
    {
      try
      {
        Concelho? Concelho = await _repository.RemoveByIdAsync<Concelho, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Concelho.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Concelhos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleConcelhosAsync(
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
            Concelho? entity = await _repository.GetByIdAsync<Concelho, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Concelho com ID {id}");
              continue;
            }

            // Try to delete the entity
            Concelho? deletedEntity = await _repository.RemoveByIdAsync<Concelho, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Concelho com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Concelho com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} concelhos.";
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
