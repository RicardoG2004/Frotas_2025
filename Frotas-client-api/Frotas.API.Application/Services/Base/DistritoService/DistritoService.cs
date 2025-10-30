using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;
using Frotas.API.Application.Services.Base.DistritoService.Filters;
using Frotas.API.Application.Services.Base.DistritoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Distrito domain entity in Frotas.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Distrito> to Frotas.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in Frotas.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Distritos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace Frotas.API.Application.Services.Base.DistritoService
{
  public class DistritoService(IRepositoryAsync repository, IMapper mapper) : IDistritoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<DistritoDTO>>> GetDistritosAsync(string keyword = "")
    {
      DistritoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<DistritoDTO> list = await _repository.GetListAsync<Distrito, DistritoDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<DistritoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<DistritoDTO>> GetDistritosPaginatedAsync(
      DistritoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      DistritoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<DistritoDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Distrito,
        DistritoDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Distrito by Id
    public async Task<Response<DistritoDTO>> GetDistritoAsync(Guid id)
    {
      try
      {
        DistritoDTO dto = await _repository.GetByIdAsync<Distrito, DistritoDTO, Guid>(id);
        return Response<DistritoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<DistritoDTO>.Fail(ex.Message);
      }
    }

    // create new Distrito
    public async Task<Response<Guid>> CreateDistritoAsync(CreateDistritoRequest request)
    {
      DistritoMatchName specification = new(request.Nome); // ardalis specification
      bool DistritoExists = await _repository.ExistsAsync<Distrito, Guid>(specification);
      if (DistritoExists)
      {
        return Response<Guid>.Fail("Já existe um distrito com o nome especificado");
      }

      Distrito newDistrito = _mapper.Map(request, new Distrito()); // map dto to domain entity

      try
      {
        Distrito response = await _repository.CreateAsync<Distrito, Guid>(newDistrito); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Distrito
    public async Task<Response<Guid>> UpdateDistritoAsync(UpdateDistritoRequest request, Guid id)
    {
      Distrito DistritoInDb = await _repository.GetByIdAsync<Distrito, Guid>(id); // get existing entity
      if (DistritoInDb == null)
      {
        return Response<Guid>.Fail("Distrito não encontrado");
      }

      Distrito updatedDistrito = _mapper.Map(request, DistritoInDb); // map dto to domain entity

      try
      {
        Distrito response = await _repository.UpdateAsync<Distrito, Guid>(updatedDistrito); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Distrito
    public async Task<Response<Guid>> DeleteDistritoAsync(Guid id)
    {
      try
      {
        Distrito? Distrito = await _repository.RemoveByIdAsync<Distrito, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Distrito.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Distritos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleDistritosAsync(
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
            Distrito? entity = await _repository.GetByIdAsync<Distrito, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Distrito com ID {id}");
              continue;
            }

            // Try to delete the entity
            Distrito? deletedEntity = await _repository.RemoveByIdAsync<Distrito, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Distrito com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Distrito com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} distritos.";
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
