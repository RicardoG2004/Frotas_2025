using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.PecaService.DTOs;
using Frotas.API.Application.Services.Frotas.PecaService.Filters;
using Frotas.API.Application.Services.Frotas.PecaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.PecaService
{
  public class PecaService(IRepositoryAsync repository, IMapper mapper)
    : IPecaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<PecaDTO>>> GetPecasAsync(string keyword = "")
    {
      PecaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<PecaDTO> list = await _repository.GetListAsync<
        Peca,
        PecaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<PecaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<PecaDTO>> GetPecasPaginatedAsync(PecaTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      PecaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<PecaDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Peca,
          PecaDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Peca by Id
    public async Task<Response<PecaDTO>> GetPecaAsync(
      Guid id
    )
    {
      try
      {
        PecaDTO dto = await _repository.GetByIdAsync<
          Peca,
          PecaDTO,
          Guid
        >(id);
        return Response<PecaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<PecaDTO>.Fail(ex.Message);
      }
    }

    // create new Peca
    public async Task<Response<Guid>> CreatePecaAsync(
      CreatePecaRequest request
    )
    {
      try
      {
        // Check if Designacao is already associated with a peca
        IEnumerable<Peca> existingPecas =
          await _repository.GetListAsync<Peca, Guid>(
            new PecaMatchName(request.Designacao)
          );
        Peca? existingPeca =
          existingPecas.FirstOrDefault();
        if (existingPeca != null)
        {
          return Response<Guid>.Fail("Já existe uma peca associada a esta designacao.");
        }

        Peca newPeca = _mapper.Map(
          request,
          new Peca()
        ); // map dto to domain entity

        // Calculate CustoTotal based on Custo and TaxaIva
        if (request.TaxaIvaId.HasValue && request.TaxaIvaId.Value != Guid.Empty)
        {
          TaxaIva? taxaIva = await _repository.GetByIdAsync<TaxaIva, Guid>(request.TaxaIvaId.Value);
          if (taxaIva != null)
          {
            decimal valorIva = (newPeca.Custo * taxaIva.Valor) / 100;
            newPeca.CustoTotal = newPeca.Custo + valorIva;
          }
          else
          {
            newPeca.CustoTotal = newPeca.Custo;
          }
        }
        else
        {
          newPeca.CustoTotal = newPeca.Custo;
        }

        Peca response = await _repository.CreateAsync<
          Peca,
          Guid
        >(newPeca); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Peca
    public async Task<Response<Guid>> UpdatePecaAsync(
      UpdatePecaRequest request,
      Guid id
    )
    {
      try
      {
        Peca PecaInDb = await _repository.GetByIdAsync<
          Peca,
          Guid
        >(id); // get existing entity
        if (PecaInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if Designacao is already associated with another peca
        IEnumerable<Peca> existingPecas =
          await _repository.GetListAsync<Peca, Guid>(
            new PecaMatchName(request.Designacao)
          );
        Peca? existingPeca =
          existingPecas.FirstOrDefault();
        if (existingPeca != null && existingPeca.Id != id)
        {
          return Response<Guid>.Fail("Já existe uma peca associada a esta designacao.");
        }

        Peca updatedPeca = _mapper.Map(
          request,
          PecaInDb
        ); // map dto to domain entity

        // Calculate CustoTotal based on Custo and TaxaIva
        if (request.TaxaIvaId.HasValue && request.TaxaIvaId.Value != Guid.Empty)
        {
          TaxaIva? taxaIva = await _repository.GetByIdAsync<TaxaIva, Guid>(request.TaxaIvaId.Value);
          if (taxaIva != null)
          {
            decimal valorIva = (updatedPeca.Custo * taxaIva.Valor) / 100;
            updatedPeca.CustoTotal = updatedPeca.Custo + valorIva;
          }
          else
          {
            updatedPeca.CustoTotal = updatedPeca.Custo;
          }
        }
        else
        {
          updatedPeca.CustoTotal = updatedPeca.Custo;
        }

        Peca response = await _repository.UpdateAsync<
          Peca,
          Guid
        >(updatedPeca); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Peca
    public async Task<Response<Guid>> DeletePecaAsync(Guid id)
    {
      try
      {
        Peca? Peca = await _repository.RemoveByIdAsync<
          Peca,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Peca.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Pecas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultiplePecasAsync(
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
            Peca? entity = await _repository.GetByIdAsync<
              Peca,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Peca com ID {id}");
              continue;
            }

            // Try to delete the entity
            Peca? deletedEntity = await _repository.RemoveByIdAsync<
              Peca,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Peca com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Peca com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} pecas.";
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

