using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.Filters;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Talhao domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Talhao> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a CemiterioTalhoes api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.TalhaoService
{
  public class TalhaoService(IRepositoryAsync repository, IMapper mapper)
    : ITalhaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<TalhaoDTO>>> GetTalhoesAsync(
      string keyword = "",
      string? cemiterioId = null
    )
    {
      TalhaoSearchList specification = new(keyword, cemiterioId); // ardalis specification
      IEnumerable<TalhaoDTO> list = await _repository.GetListAsync<
        Talhao,
        TalhaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<TalhaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<TalhaoDTO>> GetTalhoesPaginatedAsync(
      TalhaoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      TalhaoSearchTable specification = new(
        filter.Filters ?? [],
        dynamicOrder,
        filter.CemiterioId
      ); // ardalis specification
      PaginatedResponse<TalhaoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<Talhao, TalhaoDTO, Guid>(
          filter.PageNumber,
          filter.PageSize,
          specification
        ); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Talhao by Id
    public async Task<Response<TalhaoDTO>> GetTalhaoAsync(Guid id)
    {
      try
      {
        TalhaoDTO dto = await _repository.GetByIdAsync<
          Talhao,
          TalhaoDTO,
          Guid
        >(id);
        return Response<TalhaoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<TalhaoDTO>.Fail(ex.Message);
      }
    }

    // create new Talhao
    public async Task<Response<Guid>> CreateTalhaoAsync(
      CreateTalhaoRequest request
    )
    {
      TalhaoMatchNameAndZonaId specification = new(
        request.Nome,
        request.ZonaId
      ); // ardalis specification
      bool TalhaoExists = await _repository.ExistsAsync<Talhao, Guid>(
        specification
      );
      if (TalhaoExists)
      {
        return Response<Guid>.Fail("Talhao already exists");
      }

      Talhao newTalhao = _mapper.Map(request, new Talhao()); // map dto to domain entity

      try
      {
        Talhao response = await _repository.CreateAsync<Talhao, Guid>(
          newTalhao
        ); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Talhao
    public async Task<Response<Guid>> UpdateTalhaoAsync(
      UpdateTalhaoRequest request,
      Guid id
    )
    {
      Talhao TalhaoInDb = await _repository.GetByIdAsync<Talhao, Guid>(
        id
      ); // get existing entity
      if (TalhaoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Talhao updatedTalhao = _mapper.Map(request, TalhaoInDb); // map dto to domain entity

      try
      {
        Talhao response = await _repository.UpdateAsync<Talhao, Guid>(
          updatedTalhao
        ); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Talhao
    public async Task<Response<Guid>> DeleteTalhaoAsync(Guid id)
    {
      try
      {
        Talhao? Talhao = await _repository.RemoveByIdAsync<Talhao, Guid>(
          id
        );
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Talhao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> UpdateTalhaoSvgAsync(
      UpdateTalhaoSvgRequest request,
      Guid id
    )
    {
      Talhao TalhaoInDb = await _repository.GetByIdAsync<Talhao, Guid>(
        id
      );
      if (TalhaoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      TalhaoInDb.TemSvgShape = request.TemSvgShape;
      TalhaoInDb.ShapeId = request.ShapeId;

      try
      {
        Talhao response = await _repository.UpdateAsync<Talhao, Guid>(
          TalhaoInDb
        );
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple CemiterioTalhoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleTalhoesAsync(
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
            Talhao? entity = await _repository.GetByIdAsync<Talhao, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Talhão com ID {id}");
              continue;
            }

            // Try to delete the entity
            Talhao? deletedEntity = await _repository.RemoveByIdAsync<
              Talhao,
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
              failedDeletions.Add($"Talhão com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Talhão com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} talhões.";
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

