using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Filters;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a SepulturaTipo domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<SepulturaTipo> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a SepulturaTipos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService
{
  public class SepulturaTipoService(IRepositoryAsync repository, IMapper mapper)
    : ISepulturaTipoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<
      Response<IEnumerable<SepulturaTipoDTO>>
    > GetSepulturaTiposAsync(string keyword = "")
    {
      SepulturaTipoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SepulturaTipoDTO> list = await _repository.GetListAsync<
        SepulturaTipo,
        SepulturaTipoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<SepulturaTipoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<
      PaginatedResponse<SepulturaTipoDTO>
    > GetSepulturaTiposPaginatedAsync(SepulturaTipoTableFilter filter)
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SepulturaTipoSearchTable specification = new(
        filter.Filters ?? [],
        dynamicOrder,
        filter.EpocaId
      ); // ardalis specification
      PaginatedResponse<SepulturaTipoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          SepulturaTipo,
          SepulturaTipoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single SepulturaTipo by Id
    public async Task<Response<SepulturaTipoDTO>> GetSepulturaTipoAsync(Guid id)
    {
      try
      {
        SepulturaTipoDTO dto = await _repository.GetByIdAsync<
          SepulturaTipo,
          SepulturaTipoDTO,
          Guid
        >(id);
        return Response<SepulturaTipoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<SepulturaTipoDTO>.Fail(ex.Message);
      }
    }

    // create new SepulturaTipo
    public async Task<Response<Guid>> CreateSepulturaTipoAsync(
      CreateSepulturaTipoRequest request
    )
    {
      SepulturaTipoMatchName specification = new(request.Nome); // ardalis specification
      bool SepulturaTipoExists = await _repository.ExistsAsync<
        SepulturaTipo,
        Guid
      >(specification);
      if (SepulturaTipoExists)
      {
        return Response<Guid>.Fail("SepulturaTipo already exists");
      }

      SepulturaTipo newSepulturaTipo = _mapper.Map(
        request,
        new SepulturaTipo()
      ); // map dto to domain entity

      try
      {
        SepulturaTipo response = await _repository.CreateAsync<
          SepulturaTipo,
          Guid
        >(newSepulturaTipo); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update SepulturaTipo
    public async Task<Response<Guid>> UpdateSepulturaTipoAsync(
      UpdateSepulturaTipoRequest request,
      Guid id
    )
    {
      SepulturaTipo SepulturaTipoInDb = await _repository.GetByIdAsync<
        SepulturaTipo,
        Guid
      >(id); // get existing entity
      if (SepulturaTipoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      SepulturaTipo updatedSepulturaTipo = _mapper.Map(
        request,
        SepulturaTipoInDb
      ); // map dto to domain entity

      try
      {
        SepulturaTipo response = await _repository.UpdateAsync<
          SepulturaTipo,
          Guid
        >(updatedSepulturaTipo); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete SepulturaTipo
    public async Task<Response<Guid>> DeleteSepulturaTipoAsync(Guid id)
    {
      try
      {
        SepulturaTipo? SepulturaTipo = await _repository.RemoveByIdAsync<
          SepulturaTipo,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(SepulturaTipo.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple SepulturaTipos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturaTiposAsync(
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
            SepulturaTipo? entity = await _repository.GetByIdAsync<
              SepulturaTipo,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Tipo de sepultura com ID {id}");
              continue;
            }

            // Try to delete the entity
            SepulturaTipo? deletedEntity = await _repository.RemoveByIdAsync<
              SepulturaTipo,
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
              failedDeletions.Add($"Tipo de sepultura com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Tipo de sepultura com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} tipos de sepultura.";
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

