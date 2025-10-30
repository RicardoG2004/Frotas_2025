using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;
using Frotas.API.Application.Services.Frotas.MarcaService.Filters;
using Frotas.API.Application.Services.Frotas.MarcaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.MarcaService
{
  public class MarcaService : IMarcaService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public MarcaService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<MarcaDTO>>> GetMarcasAsync(string keyword = "")
    {
      MarcaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<MarcaDTO> list = await _repository.GetListAsync<Marca, MarcaDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<MarcaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<MarcaDTO>> GetMarcasPaginatedAsync(
      MarcaTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      MarcaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<MarcaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Marca,
        MarcaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Marca by Id
    public async Task<Response<MarcaDTO>> GetMarcaAsync(Guid id)
    {
      try
      {
        MarcaDTO dto = await _repository.GetByIdAsync<Marca, MarcaDTO, Guid>(id);
        return Response<MarcaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<MarcaDTO>.Fail(ex.Message);
      }
    }

    // create new Marca
    public async Task<Response<Guid>> CreateMarcaAsync(CreateMarcaRequest request)
    {
      MarcaMatchName specification = new(request.Nome); // ardalis specification
      bool MarcaExists = await _repository.ExistsAsync<Marca, Guid>(specification);
      if (MarcaExists)
      {
        return Response<Guid>.Fail("Marca already exists");
      }

      Marca newMarca = _mapper.Map(request, new Marca()); // map dto to domain entity

      try
      {
        Marca response = await _repository.CreateAsync<Marca, Guid>(newMarca); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Marca
    public async Task<Response<Guid>> UpdateMarcaAsync(UpdateMarcaRequest request, Guid id)
    {
      Marca MarcaInDb = await _repository.GetByIdAsync<Marca, Guid>(id); // get existing entity
      if (MarcaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Marca updatedMarca = _mapper.Map(request, MarcaInDb); // map dto to domain entity

      try
      {
        Marca response = await _repository.UpdateAsync<Marca, Guid>(updatedMarca); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Marca
    public async Task<Response<Guid>> DeleteMarcaAsync(Guid id)
    {
      try
      {
        Marca? Marca = await _repository.RemoveByIdAsync<Marca, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Marca.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Marcas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleMarcasAsync(
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
            Marca? entity = await _repository.GetByIdAsync<Marca, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Marca com ID {id}");
              continue;
            }

            // Try to delete the entity
            Marca? deletedEntity = await _repository.RemoveByIdAsync<Marca, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Marca com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Marca com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} marcas.";
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
