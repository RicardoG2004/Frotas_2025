using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.ConservatoriaService.DTOs;
using Frotas.API.Application.Services.Base.ConservatoriaService.Filters;
using Frotas.API.Application.Services.Base.ConservatoriaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.ConservatoriaService
{
  public class ConservatoriaService(IRepositoryAsync repository, IMapper mapper) : IConservatoriaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ConservatoriaDTO>>> GetConservatoriasAsync(string keyword = "")
    {
      ConservatoriaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ConservatoriaDTO> list = await _repository.GetListAsync<
        Conservatoria,
        ConservatoriaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<ConservatoriaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ConservatoriaDTO>> GetConservatoriasPaginatedAsync(
      ConservatoriaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ConservatoriaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ConservatoriaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Conservatoria,
        ConservatoriaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Setor by Id
    public async Task<Response<ConservatoriaDTO>> GetConservatoriaAsync(Guid id)
    {
      try
      {
        ConservatoriaDTO dto = await _repository.GetByIdAsync<Conservatoria, ConservatoriaDTO, Guid>(id);
        return Response<ConservatoriaDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<ConservatoriaDTO>.Fail(ex.Message);
      }
    }

    // create new Conservatoria
    public async Task<Response<Guid>> CreateConservatoriaAsync(CreateConservatoriaRequest request)
    {
      ConservatoriaMatchName specification = new(request.Nome); // ardalis specification
      bool ConservatoriaExists = await _repository.ExistsAsync<Conservatoria, Guid>(specification);
      if (ConservatoriaExists)
      {
        return Response<Guid>.Fail("Já existe uma conservação com o nome especificado");
      }

      Conservatoria newConservatoria = _mapper.Map(request, new Conservatoria()); // map dto to domain entity

      try
      {
        Conservatoria response = await _repository.CreateAsync<Conservatoria, Guid>(newConservatoria); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Setor
    public async Task<Response<Guid>> UpdateConservatoriaAsync(UpdateConservatoriaRequest request, Guid id)
    {
      Conservatoria ConservatoriaInDb = await _repository.GetByIdAsync<Conservatoria, Guid>(id); // get existing entity
      if (ConservatoriaInDb == null)
      {
        return Response<Guid>.Fail("Conservatoria não encontrada");
      }

      Conservatoria updatedConservatoria = _mapper.Map(request, ConservatoriaInDb); // map dto to domain entity

      try
      {
        Conservatoria response = await _repository.UpdateAsync<Conservatoria, Guid>(updatedConservatoria); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Setor
    public async Task<Response<Guid>> DeleteConservatoriaAsync(Guid id)
    {
      try
      {
        Conservatoria? Conservatoria = await _repository.RemoveByIdAsync<Conservatoria, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Conservatoria.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Conservatorias
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleConservatoriasAsync(
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
            Conservatoria? entity = await _repository.GetByIdAsync<Conservatoria, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Conservatoria com ID {id}");
              continue;
            }

            // Try to delete the entity
            Conservatoria? deletedEntity = await _repository.RemoveByIdAsync<Conservatoria, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Conservatoria com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Conservatoria com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} conservatorias.";
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
