using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Filters;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a DefuntoTipo domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<DefuntoTipo> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a DefuntoTipos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService
{
  public class DefuntoTipoService(IRepositoryAsync repository, IMapper mapper)
    : IDefuntoTipoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<DefuntoTipoDTO>>> GetDefuntoTiposAsync(
      string keyword = ""
    )
    {
      DefuntoTipoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<DefuntoTipoDTO> list = await _repository.GetListAsync<
        DefuntoTipo,
        DefuntoTipoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<DefuntoTipoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<
      PaginatedResponse<DefuntoTipoDTO>
    > GetDefuntoTiposPaginatedAsync(DefuntoTipoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      DefuntoTipoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<DefuntoTipoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          DefuntoTipo,
          DefuntoTipoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single DefuntoTipo by Id
    public async Task<Response<DefuntoTipoDTO>> GetDefuntoTipoAsync(Guid id)
    {
      try
      {
        DefuntoTipoDTO dto = await _repository.GetByIdAsync<
          DefuntoTipo,
          DefuntoTipoDTO,
          Guid
        >(id);
        return Response<DefuntoTipoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<DefuntoTipoDTO>.Fail(ex.Message);
      }
    }

    // create new DefuntoTipo
    public async Task<Response<Guid>> CreateDefuntoTipoAsync(
      CreateDefuntoTipoRequest request
    )
    {
      DefuntoTipoMatchName specification = new(request.Descricao); // ardalis specification
      bool DefuntoTipoExists = await _repository.ExistsAsync<DefuntoTipo, Guid>(
        specification
      );
      if (DefuntoTipoExists)
      {
        return Response<Guid>.Fail("DefuntoTipo already exists");
      }

      DefuntoTipo newDefuntoTipo = _mapper.Map(
        request,
        new DefuntoTipo()
      ); // map dto to domain entity

      try
      {
        DefuntoTipo response = await _repository.CreateAsync<DefuntoTipo, Guid>(
          newDefuntoTipo
        ); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update DefuntoTipo
    public async Task<Response<Guid>> UpdateDefuntoTipoAsync(
      UpdateDefuntoTipoRequest request,
      Guid id
    )
    {
      DefuntoTipo DefuntoTipoInDb = await _repository.GetByIdAsync<
        DefuntoTipo,
        Guid
      >(id); // get existing entity
      if (DefuntoTipoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      DefuntoTipo updatedDefuntoTipo = _mapper.Map(
        request,
        DefuntoTipoInDb
      ); // map dto to domain entity

      try
      {
        DefuntoTipo response = await _repository.UpdateAsync<DefuntoTipo, Guid>(
          updatedDefuntoTipo
        ); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete DefuntoTipo
    public async Task<Response<Guid>> DeleteDefuntoTipoAsync(Guid id)
    {
      try
      {
        DefuntoTipo? DefuntoTipo = await _repository.RemoveByIdAsync<
          DefuntoTipo,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(DefuntoTipo.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple DefuntoTipos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleDefuntoTiposAsync(
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
            DefuntoTipo? entity = await _repository.GetByIdAsync<
              DefuntoTipo,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Tipo de defunto com ID {id}");
              continue;
            }

            // Try to delete the entity
            DefuntoTipo? deletedEntity = await _repository.RemoveByIdAsync<
              DefuntoTipo,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Tipo de defunto com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Tipo de defunto com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} tipos de defunto.";
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

