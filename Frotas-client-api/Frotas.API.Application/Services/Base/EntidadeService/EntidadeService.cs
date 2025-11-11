using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.EntidadeService.DTOs;
using Frotas.API.Application.Services.Base.EntidadeService.Filters;
using Frotas.API.Application.Services.Base.EntidadeService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.EntidadeService
{
  public class EntidadeService : IEntidadeService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public EntidadeService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<EntidadeDTO>>> GetEntidadesAsync(string keyword = "")
    {
      EntidadeSearchList specification = new(keyword); // ardalis specification
      IEnumerable<EntidadeDTO> list = await _repository.GetListAsync<Entidade, EntidadeDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<EntidadeDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<EntidadeDTO>> GetEntidadesPaginatedAsync(
      EntidadeTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      EntidadeSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<EntidadeDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Entidade,
        EntidadeDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Fornecedor by Id
    public async Task<Response<EntidadeDTO>> GetEntidadeAsync(Guid id)
    {
      try
      {
        EntidadeDTO dto = await _repository.GetByIdAsync<Entidade, EntidadeDTO, Guid>(id);
        return Response<EntidadeDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<EntidadeDTO>.Fail(ex.Message);
      }
    }

    // create new Fornecedor
    public async Task<Response<Guid>> CreateEntidadeAsync(CreateEntidadeRequest request)
    {
      EntidadeMatchName specification = new(request.Designacao); // ardalis specification
      bool EntidadeExists = await _repository.ExistsAsync<Entidade, Guid>(specification);
      if (EntidadeExists)
      {
        return Response<Guid>.Fail("Entidade já existe");
      }

      Entidade newEntidade = _mapper.Map(request, new Entidade { Designacao = request.Designacao }); // map dto to domain entity

      try
      {
        Entidade response = await _repository.CreateAsync<Entidade, Guid>(newEntidade); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Fornecedor
    public async Task<Response<Guid>> UpdateEntidadeAsync(UpdateEntidadeRequest request, Guid id)
    {
      Entidade EntidadeInDb = await _repository.GetByIdAsync<Entidade, Guid>(id); // get existing entity
      if (EntidadeInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      Entidade updatedEntidade = _mapper.Map(request, EntidadeInDb); // map dto to domain entity

      try
      {
        Entidade response = await _repository.UpdateAsync<Entidade, Guid>(updatedEntidade); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Fornecedor
    public async Task<Response<Guid>> DeleteEntidadeAsync(Guid id)
    {
      try
      {
        Entidade? Entidade = await _repository.RemoveByIdAsync<Entidade, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Entidade.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Fornecedores
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleEntidadesAsync(
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
            Entidade? entity = await _repository.GetByIdAsync<Entidade, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Entidade com ID {id}");
              continue;
            }

            // Try to delete the entity
            Entidade? deletedEntity = await _repository.RemoveByIdAsync<Entidade, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Entidade com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Entidade com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} entidades.";
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


