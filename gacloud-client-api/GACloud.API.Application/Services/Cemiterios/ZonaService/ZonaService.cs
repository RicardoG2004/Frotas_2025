using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ZonaService.Filters;
using GACloud.API.Application.Services.Cemiterios.ZonaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Zona domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Zona> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Zonas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.ZonaService
{
  public class ZonaService(IRepositoryAsync repository, IMapper mapper)
    : IZonaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ZonaDTO>>> GetZonasAsync(
      string keyword = "",
      string? cemiterioId = null
    )
    {
      ZonaSearchList specification = new(keyword, cemiterioId); // ardalis specification
      IEnumerable<ZonaDTO> list = await _repository.GetListAsync<
        Zona,
        ZonaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<ZonaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ZonaDTO>> GetZonasPaginatedAsync(
      ZonaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ZonaSearchTable specification = new(
        filter.Filters ?? [],
        dynamicOrder,
        filter.CemiterioId
      ); // ardalis specification
      PaginatedResponse<ZonaDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<Zona, ZonaDTO, Guid>(
          filter.PageNumber,
          filter.PageSize,
          specification
        ); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Zona by Id
    public async Task<Response<ZonaDTO>> GetZonaAsync(Guid id)
    {
      try
      {
        ZonaDTO dto = await _repository.GetByIdAsync<
          Zona,
          ZonaDTO,
          Guid
        >(id);
        return Response<ZonaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ZonaDTO>.Fail(ex.Message);
      }
    }

    // create new Zona
    public async Task<Response<Guid>> CreateZonaAsync(CreateZonaRequest request)
    {
      ZonaMatchNameAndCemiterioId specification = new(request.Nome, request.CemiterioId); // ardalis specification
      bool ZonaExists = await _repository.ExistsAsync<Zona, Guid>(specification);
      if (ZonaExists)
      {
        return Response<Guid>.Fail("Zona already exists");
      }

      Zona newZona = _mapper.Map(request, new Zona()); // map dto to domain entity

      try
      {
        Zona response = await _repository.CreateAsync<Zona, Guid>(
          newZona
        ); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Zona
    public async Task<Response<Guid>> UpdateZonaAsync(
      UpdateZonaRequest request,
      Guid id
    )
    {
      Zona ZonaInDb = await _repository.GetByIdAsync<Zona, Guid>(id); // get existing entity
      if (ZonaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Zona updatedZona = _mapper.Map(request, ZonaInDb); // map dto to domain entity

      try
      {
        Zona response = await _repository.UpdateAsync<Zona, Guid>(
          updatedZona
        ); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Zona
    public async Task<Response<Guid>> DeleteZonaAsync(Guid id)
    {
      try
      {
        Zona? Zona = await _repository.RemoveByIdAsync<Zona, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Zona.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> UpdateZonaSvgAsync(
      UpdateZonaSvgRequest request,
      Guid id
    )
    {
      Zona ZonaInDb = await _repository.GetByIdAsync<Zona, Guid>(id);
      if (ZonaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      ZonaInDb.TemSvgShape = request.TemSvgShape;
      ZonaInDb.ShapeId = request.ShapeId;

      try
      {
        Zona response = await _repository.UpdateAsync<Zona, Guid>(
          ZonaInDb
        );
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Zonas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleZonasAsync(
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
            Zona? entity = await _repository.GetByIdAsync<Zona, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Zona com ID {id}");
              continue;
            }

            // Try to delete the entity
            Zona? deletedEntity = await _repository.RemoveByIdAsync<Zona, Guid>(
              id
            );
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Zona com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Zona com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} zonas.";
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

