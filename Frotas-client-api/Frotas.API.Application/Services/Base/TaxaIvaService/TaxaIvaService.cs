using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;
using Frotas.API.Application.Services.Base.TaxaIvaService.Filters;
using Frotas.API.Application.Services.Base.TaxaIvaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.TaxaIvaService
{
  public class TaxaIvaService(IRepositoryAsync repository, IMapper mapper) : ITaxaIvaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<TaxaIvaDTO>>> GetTaxasIvaAsync(string keyword = "")
    {
      TaxaIvaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<TaxaIvaDTO> list = await _repository.GetListAsync<
        TaxaIva,
        TaxaIvaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<TaxaIvaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<TaxaIvaDTO>> GetTaxasIvaPaginatedAsync(
      TaxaIvaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      TaxaIvaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<TaxaIvaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        TaxaIva,
        TaxaIvaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single TaxaIva by Id
    public async Task<Response<TaxaIvaDTO>> GetTaxaIvaAsync(Guid id)
    {
      try
      {
        TaxaIvaDTO dto = await _repository.GetByIdAsync<TaxaIva, TaxaIvaDTO, Guid>(id);
        return Response<TaxaIvaDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<TaxaIvaDTO>.Fail(ex.Message);
      }
    }

    // create new TaxaIva
    public async Task<Response<Guid>> CreateTaxaIvaAsync(CreateTaxaIvaRequest request)
    {
      TaxaIvaMatchName specification = new(request.Descricao); // ardalis specification
      bool TaxaIvaExists = await _repository.ExistsAsync<TaxaIva, Guid>(specification);
      if (TaxaIvaExists)
      {
        return Response<Guid>.Fail("Já existe uma taxa de IVA com a descrição especificada");
      }

      TaxaIva newTaxaIva = _mapper.Map(request, new TaxaIva()); // map dto to domain entity

      try
      {
        TaxaIva response = await _repository.CreateAsync<TaxaIva, Guid>(newTaxaIva); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update TaxaIva
    public async Task<Response<Guid>> UpdateTaxaIvaAsync(UpdateTaxaIvaRequest request, Guid id)
    {
      TaxaIva TaxaIvaInDb = await _repository.GetByIdAsync<TaxaIva, Guid>(id); // get existing entity
      if (TaxaIvaInDb == null)
      {
        return Response<Guid>.Fail("Taxa de IVA não encontrada");
      }

      TaxaIva updatedTaxaIva = _mapper.Map(request, TaxaIvaInDb); // map dto to domain entity

      try
      {
        TaxaIva response = await _repository.UpdateAsync<TaxaIva, Guid>(updatedTaxaIva); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Freguesia
    public async Task<Response<Guid>> DeleteTaxaIvaAsync(Guid id)
    {
      try
      {
        TaxaIva? TaxaIva = await _repository.RemoveByIdAsync<TaxaIva, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(TaxaIva.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple TaxasIva
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleTaxasIvaAsync(
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
            TaxaIva? entity = await _repository.GetByIdAsync<TaxaIva, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Taxa de IVA com ID {id}");
              continue;
            }

            // Try to delete the entity
            TaxaIva? deletedEntity = await _repository.RemoveByIdAsync<TaxaIva, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Taxa de IVA com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Taxa de IVA com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} taxas de IVA.";
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
