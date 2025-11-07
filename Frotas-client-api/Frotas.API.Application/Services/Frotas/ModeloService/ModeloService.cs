using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.Filters;
using Frotas.API.Application.Services.Frotas.ModeloService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ModeloService
{
  public class ModeloService : IModeloService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public ModeloService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<ModeloDTO>>> GetModelosAsync(string keyword = "")
    {
      ModeloSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ModeloDTO> list = await _repository.GetListAsync<Modelo, ModeloDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<ModeloDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ModeloDTO>> GetModelosPaginatedAsync(
      ModeloTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ModeloSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ModeloDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Modelo,
        ModeloDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Modelo by Id
    public async Task<Response<ModeloDTO>> GetModeloAsync(Guid id)
    {
      try
      {
        ModeloDTO dto = await _repository.GetByIdAsync<Modelo, ModeloDTO, Guid>(id);
        return Response<ModeloDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ModeloDTO>.Fail(ex.Message);
      }
    }

    // create new Modelo
    public async Task<Response<Guid>> CreateModeloAsync(CreateModeloRequest request)
    {
      ModeloMatchName specification = new(request.Nome); // ardalis specification
      bool ModeloExists = await _repository.ExistsAsync<Modelo, Guid>(specification);
      if (ModeloExists)
      {
        return Response<Guid>.Fail("Modelo already exists");
      }

      Modelo newModelo = _mapper.Map(request, new Modelo()); // map dto to domain entity

      try
      {
        Modelo response = await _repository.CreateAsync<Modelo, Guid>(newModelo); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Modelo
    public async Task<Response<Guid>> UpdateModeloAsync(UpdateModeloRequest request, Guid id)
    {
      Modelo ModeloInDb = await _repository.GetByIdAsync<Modelo, Guid>(id); // get existing entity
      if (ModeloInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Modelo updatedModelo = _mapper.Map(request, ModeloInDb); // map dto to domain entity

      try
      {
        Modelo response = await _repository.UpdateAsync<Modelo, Guid>(updatedModelo); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Modelo
    public async Task<Response<Guid>> DeleteModeloAsync(Guid id)
    {
      try
      {
        Modelo? Modelo = await _repository.RemoveByIdAsync<Modelo, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Modelo.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Modelos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleModelosAsync(
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
            Modelo? entity = await _repository.GetByIdAsync<Modelo, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Modelo com ID {id}");
              continue;
            }

            // Try to delete the entity
            Modelo? deletedEntity = await _repository.RemoveByIdAsync<Modelo, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Modelo com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Modelo com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} modelos.";
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
