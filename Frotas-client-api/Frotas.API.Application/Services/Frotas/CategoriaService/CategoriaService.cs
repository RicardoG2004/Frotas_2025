using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.Filters;
using Frotas.API.Application.Services.Frotas.CategoriaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.CategoriaService
{
  public class CategoriaService : ICategoriaService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public CategoriaService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<CategoriaDTO>>> GetCategoriasAsync(string keyword = "")
    {
      CategoriaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CategoriaDTO> list = await _repository.GetListAsync<Categoria, CategoriaDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<CategoriaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CategoriaDTO>> GetCategoriasPaginatedAsync(
      CategoriaTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CategoriaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CategoriaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Categoria,
        CategoriaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Categoria by Id
    public async Task<Response<CategoriaDTO>> GetCategoriaAsync(Guid id)
    {
      try
      {
        CategoriaDTO dto = await _repository.GetByIdAsync<Categoria, CategoriaDTO, Guid>(id);
        return Response<CategoriaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CategoriaDTO>.Fail(ex.Message);
      }
    }

    // create new Categoria
    public async Task<Response<Guid>> CreateCategoriaAsync(CreateCategoriaRequest request)
    {
      CategoriaMatchName specification = new(request.Designacao); // ardalis specification
      bool CategoriaExists = await _repository.ExistsAsync<Categoria, Guid>(specification);
      if (CategoriaExists)
      {
        return Response<Guid>.Fail("Categoria already exists");
      }

      Categoria newCategoria = _mapper.Map(request, new Categoria { Designacao = request.Designacao }); // map dto to domain entity

      try
      {
        Categoria response = await _repository.CreateAsync<Categoria, Guid>(newCategoria); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Categoria
    public async Task<Response<Guid>> UpdateCategoriaAsync(UpdateCategoriaRequest request, Guid id)
    {
      Categoria CategoriaInDb = await _repository.GetByIdAsync<Categoria, Guid>(id); // get existing entity
      if (CategoriaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Categoria updatedCategoria = _mapper.Map(request, CategoriaInDb); // map dto to domain entity

      try
      {
        Categoria response = await _repository.UpdateAsync<Categoria, Guid>(updatedCategoria); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Categoria
    public async Task<Response<Guid>> DeleteCategoriaAsync(Guid id)
    {
      try
      {
        Categoria? Categoria = await _repository.RemoveByIdAsync<Categoria, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Categoria.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Categorias
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCategoriasAsync(
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
            Categoria? entity = await _repository.GetByIdAsync<Categoria, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Categoria com ID {id}");
              continue;
            }

            // Try to delete the entity
            Categoria? deletedEntity = await _repository.RemoveByIdAsync<Categoria, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Categoria com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Categoria com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} categorias.";
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
