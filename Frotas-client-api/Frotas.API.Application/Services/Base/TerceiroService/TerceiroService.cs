using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TerceiroService.DTOs;
using Frotas.API.Application.Services.Base.TerceiroService.Filters;
using Frotas.API.Application.Services.Base.TerceiroService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.TerceiroService
{
  public class TerceiroService(IRepositoryAsync repository, IMapper mapper) : ITerceiroService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<TerceiroDTO>>> GetTerceirosAsync(string keyword = "")
    {
      TerceiroSearchList specification = new(keyword); // ardalis specification
      IEnumerable<TerceiroDTO> list = await _repository.GetListAsync<
        Terceiro,
        TerceiroDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<TerceiroDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<TerceiroDTO>> GetTerceirosPaginatedAsync(
      TerceiroTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      TerceiroSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<TerceiroDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Terceiro,
        TerceiroDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Setor by Id
    public async Task<Response<TerceiroDTO>> GetTerceiroAsync(Guid id)
    {
      try
      {
        TerceiroDTO dto = await _repository.GetByIdAsync<Terceiro, TerceiroDTO, Guid>(id);
        return Response<TerceiroDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<TerceiroDTO>.Fail(ex.Message);
      }
    }

    // create new Terceiro
    public async Task<Response<Guid>> CreateTerceiroAsync(CreateTerceiroRequest request)
    {
      TerceiroMatchName specification = new(request.Nome); // ardalis specification
      bool TerceiroExists = await _repository.ExistsAsync<Terceiro, Guid>(specification);
      if (TerceiroExists)
      {
        return Response<Guid>.Fail("Já existe um terceiro com o nome especificado");
      }

      Terceiro newTerceiro = _mapper.Map(request, new Terceiro()); // map dto to domain entity

      try
      {
        Terceiro response = await _repository.CreateAsync<Terceiro, Guid>(newTerceiro); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Terceiro
    public async Task<Response<Guid>> UpdateTerceiroAsync(UpdateTerceiroRequest request, Guid id)
    {
      Terceiro TerceiroInDb = await _repository.GetByIdAsync<Terceiro, Guid>(id); // get existing entity
      if (TerceiroInDb == null)
      {
        return Response<Guid>.Fail("Terceiro não encontrado");
      }

      Terceiro updatedTerceiro = _mapper.Map(request, TerceiroInDb); // map dto to domain entity

      try
      {
        Terceiro response = await _repository.UpdateAsync<Terceiro, Guid>(updatedTerceiro); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Terceiro
    public async Task<Response<Guid>> DeleteTerceiroAsync(Guid id)
    {
      try
      {
        Terceiro? Terceiro = await _repository.RemoveByIdAsync<Terceiro, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Terceiro.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Terceiros
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleTerceirosAsync(
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
            Terceiro? entity = await _repository.GetByIdAsync<Terceiro, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Terceiro com ID {id}");
              continue;
            }

            // Try to delete the entity
            Terceiro? deletedEntity = await _repository.RemoveByIdAsync<Terceiro, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Terceiro com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Terceiro com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} terceiros.";
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
