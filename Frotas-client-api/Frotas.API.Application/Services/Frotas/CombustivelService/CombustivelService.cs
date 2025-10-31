using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.Filters;
using Frotas.API.Application.Services.Frotas.CombustivelService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.CombustivelService
{
  public class CombustivelService : ICombustivelService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public CombustivelService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<CombustivelDTO>>> GetCombustiveisAsync(string keyword = "")
    {
      CombustivelSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CombustivelDTO> list = await _repository.GetListAsync<Combustivel, CombustivelDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<CombustivelDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CombustivelDTO>> GetCombustiveisPaginatedAsync(
      CombustivelTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CombustivelSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CombustivelDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Combustivel,
        CombustivelDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Combustivel by Id
    public async Task<Response<CombustivelDTO>> GetCombustivelAsync(Guid id)
    {
      try
      {
        CombustivelDTO dto = await _repository.GetByIdAsync<Combustivel, CombustivelDTO, Guid>(id);
        return Response<CombustivelDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CombustivelDTO>.Fail(ex.Message);
      }
    }

    // create new Combustivel
    public async Task<Response<Guid>> CreateCombustivelAsync(CreateCombustivelRequest request)
    {
      CombustivelMatchName specification = new(request.Nome); // ardalis specification
      bool CombustivelExists = await _repository.ExistsAsync<Combustivel, Guid>(specification);
      if (CombustivelExists)
      {
        return Response<Guid>.Fail("Combustivel already exists");
      }

      Combustivel newCombustivel = _mapper.Map(request, new Combustivel()); // map dto to domain entity

      try
      {
        Combustivel response = await _repository.CreateAsync<Combustivel, Guid>(newCombustivel); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Combustivel
    public async Task<Response<Guid>> UpdateCombustivelAsync(UpdateCombustivelRequest request, Guid id)
    {
      Combustivel CombustivelInDb = await _repository.GetByIdAsync<Combustivel, Guid>(id); // get existing entity
      if (CombustivelInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Combustivel updatedCombustivel = _mapper.Map(request, CombustivelInDb); // map dto to domain entity

      try
      {
        Combustivel response = await _repository.UpdateAsync<Combustivel, Guid>(updatedCombustivel); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Combustivel
    public async Task<Response<Guid>> DeleteCombustivelAsync(Guid id)
    {
      try
      {
        Combustivel? Combustivel = await _repository.RemoveByIdAsync<Combustivel, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Combustivel.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Combustiveis
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCombustiveisAsync(
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
            Combustivel? entity = await _repository.GetByIdAsync<Combustivel, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Combustivel com ID {id}");
              continue;
            }

            // Try to delete the entity
            Combustivel? deletedEntity = await _repository.RemoveByIdAsync<Combustivel, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Combustivel com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Combustivel com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} combustíveis.";
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
