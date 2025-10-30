using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.Filters;
using Frotas.API.Application.Services.Base.FreguesiaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Freguesia domain entity in Frotas.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Freguesia> to Frotas.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in Frotas.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Freguesias api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace Frotas.API.Application.Services.Base.FreguesiaService
{
  public class FreguesiaService(IRepositoryAsync repository, IMapper mapper) : IFreguesiaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<FreguesiaDTO>>> GetFreguesiasAsync(string keyword = "")
    {
      FreguesiaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<FreguesiaDTO> list = await _repository.GetListAsync<
        Freguesia,
        FreguesiaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<FreguesiaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<FreguesiaDTO>> GetFreguesiasPaginatedAsync(
      FreguesiaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      FreguesiaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<FreguesiaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Freguesia,
        FreguesiaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Freguesia by Id
    public async Task<Response<FreguesiaDTO>> GetFreguesiaAsync(Guid id)
    {
      try
      {
        FreguesiaDTO dto = await _repository.GetByIdAsync<Freguesia, FreguesiaDTO, Guid>(id);
        return Response<FreguesiaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<FreguesiaDTO>.Fail(ex.Message);
      }
    }

    // create new Freguesia
    public async Task<Response<Guid>> CreateFreguesiaAsync(CreateFreguesiaRequest request)
    {
      FreguesiaMatchName specification = new(request.Nome); // ardalis specification
      bool FreguesiaExists = await _repository.ExistsAsync<Freguesia, Guid>(specification);
      if (FreguesiaExists)
      {
        return Response<Guid>.Fail("Já existe uma freguesia com o nome especificado");
      }

      Freguesia newFreguesia = _mapper.Map(request, new Freguesia()); // map dto to domain entity

      try
      {
        Freguesia response = await _repository.CreateAsync<Freguesia, Guid>(newFreguesia); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Freguesia
    public async Task<Response<Guid>> UpdateFreguesiaAsync(UpdateFreguesiaRequest request, Guid id)
    {
      Freguesia FreguesiaInDb = await _repository.GetByIdAsync<Freguesia, Guid>(id); // get existing entity
      if (FreguesiaInDb == null)
      {
        return Response<Guid>.Fail("Freguesia não encontrada");
      }

      Freguesia updatedFreguesia = _mapper.Map(request, FreguesiaInDb); // map dto to domain entity

      try
      {
        Freguesia response = await _repository.UpdateAsync<Freguesia, Guid>(updatedFreguesia); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Freguesia
    public async Task<Response<Guid>> DeleteFreguesiaAsync(Guid id)
    {
      try
      {
        Freguesia? Freguesia = await _repository.RemoveByIdAsync<Freguesia, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Freguesia.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Freguesias
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleFreguesiasAsync(
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
            Freguesia? entity = await _repository.GetByIdAsync<Freguesia, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Freguesia com ID {id}");
              continue;
            }

            // Try to delete the entity
            Freguesia? deletedEntity = await _repository.RemoveByIdAsync<Freguesia, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Freguesia com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Freguesia com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} freguesias.";
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
