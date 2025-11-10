using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguradoraService.Filters;
using Frotas.API.Application.Services.Frotas.SeguradoraService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService
{
  public class SeguradoraService : ISeguradoraService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public SeguradoraService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<SeguradoraDTO>>> GetSeguradorasAsync(string keyword = "")
    {
      SeguradoraSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SeguradoraDTO> list = await _repository.GetListAsync<Seguradora, SeguradoraDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<SeguradoraDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<SeguradoraDTO>> GetSeguradorasPaginatedAsync(
      SeguradoraTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SeguradoraSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<SeguradoraDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Seguradora,
        SeguradoraDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Seguradora by Id
    public async Task<Response<SeguradoraDTO>> GetSeguradoraAsync(Guid id)
    {
      try
      {
        SeguradoraDTO dto = await _repository.GetByIdAsync<Seguradora, SeguradoraDTO, Guid>(id);
        return Response<SeguradoraDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<SeguradoraDTO>.Fail(ex.Message);
      }
    }

    // create new Seguradora
    public async Task<Response<Guid>> CreateSeguradoraAsync(CreateSeguradoraRequest request)
    {
      SeguradoraMatchName specification = new(request.Descricao); // ardalis specification
      bool SeguradoraExists = await _repository.ExistsAsync<Seguradora, Guid>(specification);
      if (SeguradoraExists)
      {
        return Response<Guid>.Fail("Seguradora já existe");
      }

      Seguradora newSeguradora = _mapper.Map(request, new Seguradora { Descricao = request.Descricao }); // map dto to domain entity

      try
      {
        Seguradora response = await _repository.CreateAsync<Seguradora, Guid>(newSeguradora); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Seguradora
    public async Task<Response<Guid>> UpdateSeguradoraAsync(UpdateSeguradoraRequest request, Guid id)
    {
      Seguradora SeguradoraInDb = await _repository.GetByIdAsync<Seguradora, Guid>(id); // get existing entity
      if (SeguradoraInDb == null)
      {
        return Response<Guid>.Fail("Seguradora não encontrada");
      }

      Seguradora updatedSeguradora = _mapper.Map(request, SeguradoraInDb); // map dto to domain entity

      try
      {
        Seguradora response = await _repository.UpdateAsync<Seguradora, Guid>(updatedSeguradora); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Seguradora
    public async Task<Response<Guid>> DeleteSeguradoraAsync(Guid id)
    {
      try
      {
        Seguradora? Seguradora = await _repository.RemoveByIdAsync<Seguradora, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Seguradora.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Seguradoras
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSeguradorasAsync(
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
            Seguradora? entity = await _repository.GetByIdAsync<Seguradora, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Seguradora com ID {id}");
              continue;
            }

            // Try to delete the entity
            Seguradora? deletedEntity = await _repository.RemoveByIdAsync<Seguradora, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Seguradora com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Seguradora com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} seguradoras.";
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

