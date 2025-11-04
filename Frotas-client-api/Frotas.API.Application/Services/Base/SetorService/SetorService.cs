using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.Filters;
using Frotas.API.Application.Services.Base.SetorService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.SetorService
{
  public class SetorService(IRepositoryAsync repository, IMapper mapper) : ISetorService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<SetorDTO>>> GetSetoresAsync(string keyword = "")
    {
      SetorSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SetorDTO> list = await _repository.GetListAsync<
        Setor,
        SetorDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<SetorDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<SetorDTO>> GetSetoresPaginatedAsync(
      SetorTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SetorSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<SetorDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Setor,
        SetorDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Setor by Id
    public async Task<Response<SetorDTO>> GetSetorAsync(Guid id)
    {
      try
      {
        SetorDTO dto = await _repository.GetByIdAsync<Setor, SetorDTO, Guid>(id);
        return Response<SetorDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<SetorDTO>.Fail(ex.Message);
      }
    }

    // create new Setor
    public async Task<Response<Guid>> CreateSetorAsync(CreateSetorRequest request)
    {
      SetorMatchName specification = new(request.Descricao); // ardalis specification
      bool SetorExists = await _repository.ExistsAsync<Setor, Guid>(specification);
      if (SetorExists)
      {
        return Response<Guid>.Fail("Já existe um setor com a descrição especificada");
      }

      Setor newSetor = _mapper.Map(request, new Setor()); // map dto to domain entity

      try
      {
        Setor response = await _repository.CreateAsync<Setor, Guid>(newSetor); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Setor
    public async Task<Response<Guid>> UpdateSetorAsync(UpdateSetorRequest request, Guid id)
    {
      Setor SetorInDb = await _repository.GetByIdAsync<Setor, Guid>(id); // get existing entity
      if (SetorInDb == null)
      {
        return Response<Guid>.Fail("Setor não encontrado");
      }

      Setor updatedSetor = _mapper.Map(request, SetorInDb); // map dto to domain entity

      try
      {
        Setor response = await _repository.UpdateAsync<Setor, Guid>(updatedSetor); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Setor
    public async Task<Response<Guid>> DeleteSetorAsync(Guid id)
    {
      try
      {
        Setor? Setor = await _repository.RemoveByIdAsync<Setor, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Setor.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Setores
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSetoresAsync(
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
            Setor? entity = await _repository.GetByIdAsync<Setor, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Setor com ID {id}");
              continue;
            }

            // Try to delete the entity
            Setor? deletedEntity = await _repository.RemoveByIdAsync<Setor, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Setor com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Setor com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} setores.";
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
