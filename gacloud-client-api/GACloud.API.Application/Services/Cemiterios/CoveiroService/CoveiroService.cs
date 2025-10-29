using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.Filters;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService
{
  public class CoveiroService : ICoveiroService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public CoveiroService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<CoveiroDTO>>> GetCoveirosAsync(string keyword = "")
    {
      CoveiroSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CoveiroDTO> list = await _repository.GetListAsync<Coveiro, CoveiroDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<CoveiroDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CoveiroDTO>> GetCoveirosPaginatedAsync(
      CoveiroTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CoveiroSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CoveiroDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Coveiro,
        CoveiroDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Coveiro by Id
    public async Task<Response<CoveiroDTO>> GetCoveiroAsync(Guid id)
    {
      try
      {
        CoveiroDTO dto = await _repository.GetByIdAsync<Coveiro, CoveiroDTO, Guid>(id);
        return Response<CoveiroDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CoveiroDTO>.Fail(ex.Message);
      }
    }

    // create new Coveiro
    public async Task<Response<Guid>> CreateCoveiroAsync(CreateCoveiroRequest request)
    {
      CoveiroMatchName specification = new(request.Nome); // ardalis specification
      bool CoveiroExists = await _repository.ExistsAsync<Coveiro, Guid>(specification);
      if (CoveiroExists)
      {
        return Response<Guid>.Fail("Coveiro already exists");
      }

      Coveiro newCoveiro = _mapper.Map(request, new Coveiro()); // map dto to domain entity

      try
      {
        Coveiro response = await _repository.CreateAsync<Coveiro, Guid>(newCoveiro); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Coveiro
    public async Task<Response<Guid>> UpdateCoveiroAsync(UpdateCoveiroRequest request, Guid id)
    {
      Coveiro CoveiroInDb = await _repository.GetByIdAsync<Coveiro, Guid>(id); // get existing entity
      if (CoveiroInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Coveiro updatedCoveiro = _mapper.Map(request, CoveiroInDb); // map dto to domain entity

      try
      {
        Coveiro response = await _repository.UpdateAsync<Coveiro, Guid>(updatedCoveiro); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Coveiro
    public async Task<Response<Guid>> DeleteCoveiroAsync(Guid id)
    {
      try
      {
        Coveiro? Coveiro = await _repository.RemoveByIdAsync<Coveiro, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Coveiro.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Coveiros
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCoveirosAsync(
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
            Coveiro? entity = await _repository.GetByIdAsync<Coveiro, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Coveiro com ID {id}");
              continue;
            }

            // Try to delete the entity
            Coveiro? deletedEntity = await _repository.RemoveByIdAsync<Coveiro, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Coveiro com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Coveiro com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} coveiros.";
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
