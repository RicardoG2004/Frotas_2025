using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguroService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguroService.Filters;
using Frotas.API.Application.Services.Frotas.SeguroService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.SeguroService
{
  public class SeguroService : ISeguroService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public SeguroService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<SeguroDTO>>> GetSegurosAsync(string keyword = "")
    {
      SeguroSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SeguroDTO> list = await _repository.GetListAsync<Seguro, SeguroDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<SeguroDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<SeguroDTO>> GetSegurosPaginatedAsync(
      SeguroTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SeguroSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<SeguroDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Seguro,
        SeguroDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Seguro by Id
    public async Task<Response<SeguroDTO>> GetSeguroAsync(Guid id)
    {
      try
      {
        SeguroById specification = new(id);
        SeguroDTO dto = await _repository.GetByIdAsync<Seguro, SeguroDTO, Guid>(id, specification);
        return Response<SeguroDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<SeguroDTO>.Fail(ex.Message);
      }
    }

    // create new Seguro
    public async Task<Response<Guid>> CreateSeguroAsync(CreateSeguroRequest request)
    {
      SeguroMatchName specification = new(request.Designacao); // ardalis specification
      bool SeguroExists = await _repository.ExistsAsync<Seguro, Guid>(specification);
      if (SeguroExists)
      {
        return Response<Guid>.Fail("Seguro já existe");
      }

      Seguro newSeguro = _mapper.Map(request, new Seguro { Designacao = request.Designacao }); // map dto to domain entity

      try
      {
        Seguro response = await _repository.CreateAsync<Seguro, Guid>(newSeguro); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Seguro
    public async Task<Response<Guid>> UpdateSeguroAsync(UpdateSeguroRequest request, Guid id)
    {
      Seguro SeguroInDb = await _repository.GetByIdAsync<Seguro, Guid>(id); // get existing entity
      if (SeguroInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      Seguro updatedSeguro = _mapper.Map(request, SeguroInDb); // map dto to domain entity

      try
      {
        Seguro response = await _repository.UpdateAsync<Seguro, Guid>(updatedSeguro); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Seguro
    public async Task<Response<Guid>> DeleteSeguroAsync(Guid id)
    {
      try
      {
        Seguro? Seguro = await _repository.RemoveByIdAsync<Seguro, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Seguro.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Seguros
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSegurosAsync(
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
            Seguro? entity = await _repository.GetByIdAsync<Seguro, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Seguro com ID {id}");
              continue;
            }

            // Try to delete the entity
            Seguro? deletedEntity = await _repository.RemoveByIdAsync<Seguro, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Seguro com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Seguro com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} seguros.";
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

