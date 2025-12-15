using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.Filters;
using Frotas.API.Application.Services.Frotas.ReservaOficinaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService
{
  public class ReservaOficinaService(IRepositoryAsync repository, IMapper mapper)
    : IReservaOficinaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaAsync(string keyword = "")
    {
      ReservaOficinaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ReservaOficinaDTO> list = await _repository.GetListAsync<
        ReservaOficina,
        ReservaOficinaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<ReservaOficinaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ReservaOficinaDTO>> GetReservasOficinaPaginatedAsync(ReservaOficinaTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ReservaOficinaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ReservaOficinaDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          ReservaOficina,
          ReservaOficinaDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single ReservaOficina by Id
    public async Task<Response<ReservaOficinaDTO>> GetReservaOficinaAsync(
      Guid id
    )
    {
      try
      {
        ReservaOficinaDTO dto = await _repository.GetByIdAsync<
          ReservaOficina,
          ReservaOficinaDTO,
          Guid
        >(id);
        return Response<ReservaOficinaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ReservaOficinaDTO>.Fail(ex.Message);
      }
    }

    // get ReservasOficina by Funcionario
    public async Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaByFuncionarioAsync(Guid funcionarioId)
    {
      try
      {
        ReservaOficinaByFuncionarioSpecification specification = new(funcionarioId);
        IEnumerable<ReservaOficinaDTO> list = await _repository.GetListAsync<
          ReservaOficina,
          ReservaOficinaDTO,
          Guid
        >(specification);
        return Response<IEnumerable<ReservaOficinaDTO>>.Success(list);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<ReservaOficinaDTO>>.Fail(ex.Message);
      }
    }

    // get ReservasOficina by Date
    public async Task<Response<IEnumerable<ReservaOficinaDTO>>> GetReservasOficinaByDateAsync(DateTime dataReserva)
    {
      try
      {
        ReservaOficinaSearchList specification = new("");
        IEnumerable<ReservaOficina> reservas = await _repository.GetListAsync<ReservaOficina, Guid>(specification);
        IEnumerable<ReservaOficinaDTO> reservasFiltradas = _mapper.Map<IEnumerable<ReservaOficinaDTO>>(
          reservas.Where(r => r.DataReserva.Date == dataReserva.Date)
                   .OrderBy(r => r.HoraInicio)
        );
        return Response<IEnumerable<ReservaOficinaDTO>>.Success(reservasFiltradas);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<ReservaOficinaDTO>>.Fail(ex.Message);
      }
    }

    // create new ReservaOficina
    public async Task<Response<Guid>> CreateReservaOficinaAsync(
      CreateReservaOficinaRequest request
    )
    {
      try
      {
        // Check if ReservaOficina already exists with same Funcionario and DataReserva
        IEnumerable<ReservaOficina> existingReservas =
          await _repository.GetListAsync<ReservaOficina, Guid>(
            new ReservaOficinaByFuncionarioAndDateSpecification(request.FuncionarioId, request.DataReserva)
          );
        ReservaOficina? existingReserva =
          existingReservas.FirstOrDefault();
        if (existingReserva != null)
        {
          return Response<Guid>.Fail("Já existe uma reserva para este funcionário nesta data.");
        }

        // Create entity manually to avoid AutoMapper issues with navigation properties
        ReservaOficina newReservaOficina = new()
        {
          DataReserva = request.DataReserva,
          FuncionarioId = request.FuncionarioId,
          ViaturaId = request.ViaturaId,
          HoraInicio = request.HoraInicio,
          HoraFim = request.HoraFim,
          Causa = request.Causa,
          Observacoes = request.Observacoes,
        };

        ReservaOficina response = await _repository.CreateAsync<
          ReservaOficina,
          Guid
        >(newReservaOficina); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Erro ao criar reserva: {ex.Message}. StackTrace: {ex.StackTrace}");
      }
    }

    // update ReservaOficina
    public async Task<Response<Guid>> UpdateReservaOficinaAsync(
      UpdateReservaOficinaRequest request,
      Guid id
    )
    {
      try
      {
        ReservaOficina ReservaOficinaInDb = await _repository.GetByIdAsync<
          ReservaOficina,
          Guid
        >(id); // get existing entity
        if (ReservaOficinaInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if ReservaOficina already exists with same Funcionario and DataReserva (excluding current)
        IEnumerable<ReservaOficina> existingReservas =
          await _repository.GetListAsync<ReservaOficina, Guid>(
            new ReservaOficinaByFuncionarioAndDateSpecification(request.FuncionarioId, request.DataReserva)
          );
        ReservaOficina? existingReserva =
          existingReservas.FirstOrDefault();
        if (existingReserva != null && existingReserva.Id != id)
        {
          return Response<Guid>.Fail("Já existe uma reserva para este funcionário nesta data.");
        }

        ReservaOficina updatedReservaOficina = _mapper.Map(
          request,
          ReservaOficinaInDb
        ); // map dto to domain entity

        ReservaOficina response = await _repository.UpdateAsync<
          ReservaOficina,
          Guid
        >(updatedReservaOficina); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete ReservaOficina
    public async Task<Response<Guid>> DeleteReservaOficinaAsync(Guid id)
    {
      try
      {
        ReservaOficina? ReservaOficina = await _repository.RemoveByIdAsync<
          ReservaOficina,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(ReservaOficina.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple ReservasOficina
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleReservasOficinaAsync(
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
            ReservaOficina? entity = await _repository.GetByIdAsync<
              ReservaOficina,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Reserva de oficina com ID {id}");
              continue;
            }

            // Try to delete the entity
            ReservaOficina? deletedEntity = await _repository.RemoveByIdAsync<
              ReservaOficina,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Reserva de oficina com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Reserva de oficina com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} reservas de oficina.";
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

