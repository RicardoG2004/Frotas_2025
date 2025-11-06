using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.DelegacaoService.Filters;
using Frotas.API.Application.Services.Base.DelegacaoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.DelegacaoService
{
  public class DelegacaoService(IRepositoryAsync repository, IMapper mapper) : IDelegacaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<DelegacaoDTO>>> GetDelegacoesAsync(string keyword = "")
    {
      DelegacaoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<DelegacaoDTO> list = await _repository.GetListAsync<
        Delegacao,
        DelegacaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<DelegacaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<DelegacaoDTO>> GetDelegacoesPaginatedAsync(
      DelegacaoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      DelegacaoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<DelegacaoDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Delegacao,
        DelegacaoDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Delegacao by Id
    public async Task<Response<DelegacaoDTO>> GetDelegacaoAsync(Guid id)
    {
      try
      {
        DelegacaoDTO dto = await _repository.GetByIdAsync<Delegacao, DelegacaoDTO, Guid>(id);
        return Response<DelegacaoDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<DelegacaoDTO>.Fail(ex.Message);
      }
    }

    // create new Delegacao
    public async Task<Response<Guid>> CreateDelegacaoAsync(CreateDelegacaoRequest request)
    {
      DelegacaoMatchName specification = new(request.Designacao); // ardalis specification
      bool DelegacaoExists = await _repository.ExistsAsync<Delegacao, Guid>(specification);
      if (DelegacaoExists)
      {
        return Response<Guid>.Fail("Já existe uma delegação com a designação especificada");
      }

      Delegacao newDelegacao = _mapper.Map(request, new Delegacao()); // map dto to domain entity

      try
      {
        Delegacao response = await _repository.CreateAsync<Delegacao, Guid>(newDelegacao); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Delegacao
    public async Task<Response<Guid>> UpdateDelegacaoAsync(UpdateDelegacaoRequest request, Guid id)
    {
      Delegacao DelegacaoInDb = await _repository.GetByIdAsync<Delegacao, Guid>(id); // get existing entity
      if (DelegacaoInDb == null)
      {
        return Response<Guid>.Fail("Delegacao não encontrada");
      }

      Delegacao updatedDelegacao = _mapper.Map(request, DelegacaoInDb); // map dto to domain entity

      try
      {
        Delegacao response = await _repository.UpdateAsync<Delegacao, Guid>(updatedDelegacao); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Delegacao
    public async Task<Response<Guid>> DeleteDelegacaoAsync(Guid id)
    {
      try
      {
        Delegacao? Delegacao = await _repository.RemoveByIdAsync<Delegacao, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Delegacao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Delegacoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleDelegacoesAsync(
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
            Delegacao? entity = await _repository.GetByIdAsync<Delegacao, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Delegacao com ID {id}");
              continue;
            }

            // Try to delete the entity
            Delegacao? deletedEntity = await _repository.RemoveByIdAsync<Delegacao, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Delegacao com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Delegacao com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} delegações.";
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
