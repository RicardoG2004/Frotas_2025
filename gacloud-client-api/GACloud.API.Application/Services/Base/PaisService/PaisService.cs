using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.PaisService.DTOs;
using GACloud.API.Application.Services.Base.PaisService.Filters;
using GACloud.API.Application.Services.Base.PaisService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Pais domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Pais> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Paises api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.PaisService
{
  public class PaisService(IRepositoryAsync repository, IMapper mapper) : IPaisService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<PaisDTO>>> GetPaisesAsync(string keyword = "")
    {
      PaisSearchList specification = new(keyword); // ardalis specification
      IEnumerable<PaisDTO> list = await _repository.GetListAsync<Pais, PaisDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<PaisDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<PaisDTO>> GetPaisesPaginatedAsync(PaisTableFilter filter)
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      PaisSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<PaisDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Pais,
        PaisDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Pais by Id
    public async Task<Response<PaisDTO>> GetPaisAsync(Guid id)
    {
      try
      {
        PaisDTO dto = await _repository.GetByIdAsync<Pais, PaisDTO, Guid>(id);
        return Response<PaisDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<PaisDTO>.Fail(ex.Message);
      }
    }

    // create new Pais
    public async Task<Response<Guid>> CreatePaisAsync(CreatePaisRequest request)
    {
      PaisMatchName specification = new(request.Nome); // ardalis specification
      bool PaisExists = await _repository.ExistsAsync<Pais, Guid>(specification);
      if (PaisExists)
      {
        return Response<Guid>.Fail("Já existe um país com o nome fornecido");
      }

      Pais newPais = _mapper.Map(request, new Pais()); // map dto to domain entity

      try
      {
        Pais response = await _repository.CreateAsync<Pais, Guid>(newPais); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Pais
    public async Task<Response<Guid>> UpdatePaisAsync(UpdatePaisRequest request, Guid id)
    {
      Pais PaisInDb = await _repository.GetByIdAsync<Pais, Guid>(id); // get existing entity
      if (PaisInDb == null)
      {
        return Response<Guid>.Fail("País não encontrado");
      }

      Pais updatedPais = _mapper.Map(request, PaisInDb); // map dto to domain entity

      try
      {
        Pais response = await _repository.UpdateAsync<Pais, Guid>(updatedPais); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Pais
    public async Task<Response<Guid>> DeletePaisAsync(Guid id)
    {
      try
      {
        Pais? Pais = await _repository.RemoveByIdAsync<Pais, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Pais.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Paises
    public async Task<Response<IEnumerable<Guid>>> DeleteMultiplePaisesAsync(IEnumerable<Guid> ids)
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
            Pais? entity = await _repository.GetByIdAsync<Pais, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"País com ID {id}");
              continue;
            }

            // Try to delete the entity
            Pais? deletedEntity = await _repository.RemoveByIdAsync<Pais, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"País com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"País com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} países.";
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
