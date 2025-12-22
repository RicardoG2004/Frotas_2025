using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.DTOs;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.Filters;
using Frotas.API.Application.Services.Frotas.UtilizacaoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService
{
  public class UtilizacaoService(IRepositoryAsync repository, IMapper mapper)
    : IUtilizacaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesAsync(string keyword = "")
    {
      UtilizacaoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<UtilizacaoDTO> list = await _repository.GetListAsync<
        Utilizacao,
        UtilizacaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<UtilizacaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<UtilizacaoDTO>> GetUtilizacoesPaginatedAsync(UtilizacaoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      UtilizacaoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<UtilizacaoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Utilizacao,
          UtilizacaoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Utilizacao by Id
    public async Task<Response<UtilizacaoDTO>> GetUtilizacaoAsync(
      Guid id
    )
    {
      try
      {
        UtilizacaoDTO dto = await _repository.GetByIdAsync<
          Utilizacao,
          UtilizacaoDTO,
          Guid
        >(id);
        return Response<UtilizacaoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<UtilizacaoDTO>.Fail(ex.Message);
      }
    }

    // get Utilizacoes by Funcionario
    public async Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesByFuncionarioAsync(Guid funcionarioId)
    {
      try
      {
        UtilizacaoByFuncionarioSpecification specification = new(funcionarioId);
        IEnumerable<UtilizacaoDTO> list = await _repository.GetListAsync<
          Utilizacao,
          UtilizacaoDTO,
          Guid
        >(specification);
        return Response<IEnumerable<UtilizacaoDTO>>.Success(list);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<UtilizacaoDTO>>.Fail(ex.Message);
      }
    }

    // get Utilizacoes by Date
    public async Task<Response<IEnumerable<UtilizacaoDTO>>> GetUtilizacoesByDateAsync(DateTime dataUtilizacao)
    {
      try
      {
        UtilizacaoSearchList specification = new("");
        IEnumerable<Utilizacao> utilizacoes = await _repository.GetListAsync<Utilizacao, Guid>(specification);
        IEnumerable<UtilizacaoDTO> utilizacoesFiltradas = _mapper.Map<IEnumerable<UtilizacaoDTO>>(
          utilizacoes.Where(u => u.DataUtilizacao.Date == dataUtilizacao.Date)
                   .OrderBy(u => u.HoraInicio)
        );
        return Response<IEnumerable<UtilizacaoDTO>>.Success(utilizacoesFiltradas);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<UtilizacaoDTO>>.Fail(ex.Message);
      }
    }

    // create new Utilizacao
    public async Task<Response<Guid>> CreateUtilizacaoAsync(
      CreateUtilizacaoRequest request
    )
    {
      try
      {
        // Check if Utilizacao already exists with same Funcionario and DataUtilizacao
        IEnumerable<Utilizacao> existingUtilizacoes =
          await _repository.GetListAsync<Utilizacao, Guid>(
            new UtilizacaoByFuncionarioAndDateSpecification(request.FuncionarioId, request.DataUtilizacao)
          );
        Utilizacao? existingUtilizacao =
          existingUtilizacoes.FirstOrDefault();
        if (existingUtilizacao != null)
        {
          return Response<Guid>.Fail("Já existe uma utilização para este funcionário nesta data.");
        }

        // Create entity manually to avoid AutoMapper issues with navigation properties
        Utilizacao newUtilizacao = new()
        {
          DataUtilizacao = request.DataUtilizacao,
          DataUltimaConferencia = request.DataUltimaConferencia,
          FuncionarioId = request.FuncionarioId,
          ViaturaId = request.ViaturaId,
          HoraInicio = request.HoraInicio,
          HoraFim = request.HoraFim,
          ValorCombustivel = request.ValorCombustivel,
          KmPartida = request.KmPartida,
          KmChegada = request.KmChegada,
          TotalKmEfectuados = request.TotalKmEfectuados,
          TotalKmConferidos = request.TotalKmConferidos,
          TotalKmAConferir = request.TotalKmAConferir,
          Causa = request.Causa,
          Observacoes = request.Observacoes,
        };

        Utilizacao response = await _repository.CreateAsync<
          Utilizacao,
          Guid
        >(newUtilizacao); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Erro ao criar utilização: {ex.Message}. StackTrace: {ex.StackTrace}");
      }
    }

    // update Utilizacao
    public async Task<Response<Guid>> UpdateUtilizacaoAsync(
      UpdateUtilizacaoRequest request,
      Guid id
    )
    {
      try
      {
        Utilizacao UtilizacaoInDb = await _repository.GetByIdAsync<
          Utilizacao,
          Guid
        >(id); // get existing entity
        if (UtilizacaoInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if Utilizacao already exists with same Funcionario and DataUtilizacao (excluding current)
        IEnumerable<Utilizacao> existingUtilizacoes =
          await _repository.GetListAsync<Utilizacao, Guid>(
            new UtilizacaoByFuncionarioAndDateSpecification(request.FuncionarioId, request.DataUtilizacao)
          );
        Utilizacao? existingUtilizacao =
          existingUtilizacoes.FirstOrDefault();
        if (existingUtilizacao != null && existingUtilizacao.Id != id)
        {
          return Response<Guid>.Fail("Já existe uma utilização para este funcionário nesta data.");
        }

        Utilizacao updatedUtilizacao = _mapper.Map(
          request,
          UtilizacaoInDb
        ); // map dto to domain entity

        Utilizacao response = await _repository.UpdateAsync<
          Utilizacao,
          Guid
        >(updatedUtilizacao); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Utilizacao
    public async Task<Response<Guid>> DeleteUtilizacaoAsync(Guid id)
    {
      try
      {
        Utilizacao? Utilizacao = await _repository.RemoveByIdAsync<
          Utilizacao,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Utilizacao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Utilizacoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleUtilizacoesAsync(
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
            Utilizacao? entity = await _repository.GetByIdAsync<
              Utilizacao,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Utilização com ID {id}");
              continue;
            }

            // Try to delete the entity
            Utilizacao? deletedEntity = await _repository.RemoveByIdAsync<
              Utilizacao,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Utilização com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Utilização com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} utilizações.";
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

