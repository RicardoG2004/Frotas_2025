using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.FornecedorService.DTOs;
using Frotas.API.Application.Services.Frotas.FornecedorService.Filters;
using Frotas.API.Application.Services.Frotas.FornecedorService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.FornecedorService
{
  public class FornecedorService : IFornecedorService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public FornecedorService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<FornecedorDTO>>> GetFornecedoresAsync(string keyword = "")
    {
      FornecedorSearchList specification = new(keyword); // ardalis specification
      IEnumerable<FornecedorDTO> list = await _repository.GetListAsync<Fornecedor, FornecedorDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<FornecedorDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<FornecedorDTO>> GetFornecedoresPaginatedAsync(
      FornecedorTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      FornecedorSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<FornecedorDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Fornecedor,
        FornecedorDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Fornecedor by Id
    public async Task<Response<FornecedorDTO>> GetFornecedorAsync(Guid id)
    {
      try
      {
        FornecedorDTO dto = await _repository.GetByIdAsync<Fornecedor, FornecedorDTO, Guid>(id);
        return Response<FornecedorDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<FornecedorDTO>.Fail(ex.Message);
      }
    }

    // create new Fornecedor
    public async Task<Response<Guid>> CreateFornecedorAsync(CreateFornecedorRequest request)
    {
      FornecedorMatchName specification = new(request.Nome); // ardalis specification
      bool FornecedorExists = await _repository.ExistsAsync<Fornecedor, Guid>(specification);
      if (FornecedorExists)
      {
        return Response<Guid>.Fail("Fornecedor já existe");
      }

      Fornecedor newFornecedor = _mapper.Map(request, new Fornecedor { Nome = request.Nome }); // map dto to domain entity

      try
      {
        Fornecedor response = await _repository.CreateAsync<Fornecedor, Guid>(newFornecedor); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Fornecedor
    public async Task<Response<Guid>> UpdateFornecedorAsync(UpdateFornecedorRequest request, Guid id)
    {
      Fornecedor FornecedorInDb = await _repository.GetByIdAsync<Fornecedor, Guid>(id); // get existing entity
      if (FornecedorInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      Fornecedor updatedFornecedor = _mapper.Map(request, FornecedorInDb); // map dto to domain entity

      try
      {
        Fornecedor response = await _repository.UpdateAsync<Fornecedor, Guid>(updatedFornecedor); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Fornecedor
    public async Task<Response<Guid>> DeleteFornecedorAsync(Guid id)
    {
      try
      {
        Fornecedor? Fornecedor = await _repository.RemoveByIdAsync<Fornecedor, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Fornecedor.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Fornecedores
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleFornecedoresAsync(
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
            Fornecedor? entity = await _repository.GetByIdAsync<Fornecedor, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Fornecedor com ID {id}");
              continue;
            }

            // Try to delete the entity
            Fornecedor? deletedEntity = await _repository.RemoveByIdAsync<Fornecedor, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Fornecedor com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Fornecedor com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} fornecedores.";
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

