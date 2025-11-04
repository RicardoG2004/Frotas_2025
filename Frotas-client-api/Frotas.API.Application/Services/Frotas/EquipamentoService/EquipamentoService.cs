using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.Filters;
using Frotas.API.Application.Services.Frotas.EquipamentoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService
{
  public class EquipamentoService(IRepositoryAsync repository, IMapper mapper)
    : IEquipamentoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<EquipamentoDTO>>> GetEquipamentosAsync(string keyword = "")
    {
      EquipamentoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<EquipamentoDTO> list = await _repository.GetListAsync<
        Equipamento,
        EquipamentoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<EquipamentoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<EquipamentoDTO>> GetEquipamentosPaginatedAsync(EquipamentoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      EquipamentoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<EquipamentoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Equipamento,
          EquipamentoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Equipamento by Id
    public async Task<Response<EquipamentoDTO>> GetEquipamentoAsync(
      Guid id
    )
    {
      try
      {
        EquipamentoDTO dto = await _repository.GetByIdAsync<
          Equipamento,
          EquipamentoDTO,
          Guid
        >(id);
        return Response<EquipamentoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<EquipamentoDTO>.Fail(ex.Message);
      }
    }

    // create new Equipamento
    public async Task<Response<Guid>> CreateEquipamentoAsync(
      CreateEquipamentoRequest request
    )
    {
      try
      {
        // Check if Designacao is already associated with a equipamento
        IEnumerable<Equipamento> existingEquipamentos =
          await _repository.GetListAsync<Equipamento, Guid>(
            new EquipamentoMatchName(request.Designacao)
          );
        Equipamento? existingEquipamento =
          existingEquipamentos.FirstOrDefault();
        if (existingEquipamento != null)
        {
          return Response<Guid>.Fail("Já existe um equipamento associado a esta designacao.");
        }

        Equipamento newEquipamento = _mapper.Map(
          request,
          new Equipamento()
        ); // map dto to domain entity

        Equipamento response = await _repository.CreateAsync<
          Equipamento,
          Guid
        >(newEquipamento); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Peca
    public async Task<Response<Guid>> UpdateEquipamentoAsync(
      UpdateEquipamentoRequest request,
      Guid id
    )
    {
      try
      {
        Equipamento EquipamentoInDb = await _repository.GetByIdAsync<
          Equipamento,
          Guid
        >(id); // get existing entity
        if (EquipamentoInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if Designacao is already associated with another peca
        IEnumerable<Equipamento> existingEquipamentos =
          await _repository.GetListAsync<Equipamento, Guid>(
            new EquipamentoMatchName(request.Designacao)
          );
        Equipamento? existingEquipamento =
          existingEquipamentos.FirstOrDefault();
        if (existingEquipamento != null && existingEquipamento.Id != id)
        {
          return Response<Guid>.Fail("Já existe um equipamento associado a esta designacao.");
        }

        Equipamento updatedEquipamento = _mapper.Map(
          request,
          EquipamentoInDb
        ); // map dto to domain entity


        Equipamento response = await _repository.UpdateAsync<
          Equipamento,
          Guid
        >(updatedEquipamento); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Equipamento
    public async Task<Response<Guid>> DeleteEquipamentoAsync(Guid id)
    {
      try
      {
        Equipamento? Equipamento = await _repository.RemoveByIdAsync<
          Equipamento,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Equipamento.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Equipamentos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleEquipamentosAsync(
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
            Equipamento? entity = await _repository.GetByIdAsync<
              Equipamento,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Equipamento com ID {id}");
              continue;
            }

            // Try to delete the entity
            Equipamento? deletedEntity = await _repository.RemoveByIdAsync<
              Equipamento,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Equipamento com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Equipamento com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} equipamentos.";
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

