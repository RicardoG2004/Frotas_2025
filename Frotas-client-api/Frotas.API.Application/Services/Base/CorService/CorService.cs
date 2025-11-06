using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CorService.DTOs;
using Frotas.API.Application.Services.Base.CorService.Filters;
using Frotas.API.Application.Services.Base.CorService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.CorService
{
  public class CorService(IRepositoryAsync repository, IMapper mapper) : ICorService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<CorDTO>>> GetCoresAsync(string keyword = "")
    {
      CorSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CorDTO> list = await _repository.GetListAsync<Cor, CorDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<CorDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CorDTO>> GetCoresPaginatedAsync(
      CorTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CorSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CorDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Cor,
        CorDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Cor by Id
    public async Task<Response<CorDTO>> GetCorAsync(Guid id)
    {
      try
      {
        CorDTO dto = await _repository.GetByIdAsync<Cor, CorDTO, Guid>(id);
        return Response<CorDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CorDTO>.Fail(ex.Message);
      }
    }

    // create new Cor
    public async Task<Response<Guid>> CreateCorAsync(CreateCorRequest request)
    {
      CorMatchName specification = new(request.Designacao); // ardalis specification
      bool CorExists = await _repository.ExistsAsync<Cor, Guid>(specification);
      if (CorExists)
      {
        return Response<Guid>.Fail("Já existe uma cor com a designação especificada");
      }

      Cor newCor = _mapper.Map(request, new Cor()); // map dto to domain entity

      try
      {
        Cor response = await _repository.CreateAsync<Cor, Guid>(newCor); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Cor
    public async Task<Response<Guid>> UpdateCorAsync(UpdateCorRequest request, Guid id)
    {
      Cor CorInDb = await _repository.GetByIdAsync<Cor, Guid>(id); // get existing entity
      if (CorInDb == null)
      {
        return Response<Guid>.Fail("Cor não encontrada");
      }

      Cor updatedCor = _mapper.Map(request, CorInDb); // map dto to domain entity

      try
      {
        Cor response = await _repository.UpdateAsync<Cor, Guid>(updatedCor); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Cor
    public async Task<Response<Guid>> DeleteCorAsync(Guid id)
    {
      try
      {
        Cor? Cor = await _repository.RemoveByIdAsync<Cor, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Cor.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Cores
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCoresAsync(
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
            Cor? entity = await _repository.GetByIdAsync<Cor, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Cor com ID {id}");
              continue;
            }

            // Try to delete the entity
            Cor? deletedEntity = await _repository.RemoveByIdAsync<Cor, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Cor com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Cor com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} cores.";
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
