using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs;
using Frotas.API.Application.Services.Frotas.ManutencaoService.Filters;
using Frotas.API.Application.Services.Frotas.ManutencaoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService
{
  public class ManutencaoService(IRepositoryAsync repository, IMapper mapper)
    : IManutencaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ManutencaoDTO>>> GetManutencoesAsync(string keyword = "")
    {
      ManutencaoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ManutencaoDTO> list = await _repository.GetListAsync<
        Manutencao,
        ManutencaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<ManutencaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ManutencaoDTO>> GetManutencoesPaginatedAsync(ManutencaoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ManutencaoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ManutencaoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Manutencao,
          ManutencaoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Manutencao by Id
    public async Task<Response<ManutencaoDTO>> GetManutencaoAsync(
      Guid id
    )
    {
      try
      {
        ManutencaoDTO dto = await _repository.GetByIdAsync<
          Manutencao,
          ManutencaoDTO,
          Guid
        >(id);
        return Response<ManutencaoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ManutencaoDTO>.Fail(ex.Message);
      }
    }

    // create new Manutencao
    public async Task<Response<Guid>> CreateManutencaoAsync(
      CreateManutencaoRequest request
    )
    {
      try
      {
        // Check if Manutencao already exists with same Viatura, DataEntrada and HoraEntrada
        IEnumerable<Manutencao> existingManutencoes =
          await _repository.GetListAsync<Manutencao, Guid>(
            new ManutencaoMatchName(request.ViaturaId, request.DataEntrada, request.HoraEntrada)
          );
        Manutencao? existingManutencao =
          existingManutencoes.FirstOrDefault();
        if (existingManutencao != null)
        {
          return Response<Guid>.Fail("Já existe uma manutenção associada a esta viatura com a mesma data e hora de entrada.");
        }

        Manutencao newManutencao = _mapper.Map(
          request,
          new Manutencao()
        ); // map dto to domain entity

        Manutencao response = await _repository.CreateAsync<
          Manutencao,
          Guid
        >(newManutencao); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        // Create ManutencaoServicos if provided
        if (request.Servicos != null && request.Servicos.Any())
        {
          foreach (var servicoRequest in request.Servicos)
          {
            ManutencaoServico manutencaoServico = _mapper.Map(
              servicoRequest,
              new ManutencaoServico()
            );
            manutencaoServico.ManutencaoId = response.Id;
            _ = await _repository.CreateAsync<ManutencaoServico, Guid>(manutencaoServico);
          }
          _ = await _repository.SaveChangesAsync();
        }

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Manutencao
    public async Task<Response<Guid>> UpdateManutencaoAsync(
      UpdateManutencaoRequest request,
      Guid id
    )
    {
      try
      {
        Manutencao ManutencaoInDb = await _repository.GetByIdAsync<
          Manutencao,
          Guid
        >(id); // get existing entity
        if (ManutencaoInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if Manutencao already exists with same Viatura, DataEntrada and HoraEntrada (excluding current)
        IEnumerable<Manutencao> existingManutencoes =
          await _repository.GetListAsync<Manutencao, Guid>(
            new ManutencaoMatchName(request.ViaturaId, request.DataEntrada, request.HoraEntrada)
          );
        Manutencao? existingManutencao =
          existingManutencoes.FirstOrDefault();
        if (existingManutencao != null && existingManutencao.Id != id)
        {
          return Response<Guid>.Fail("Já existe uma manutenção associada a esta viatura com a mesma data e hora de entrada.");
        }

        Manutencao updatedManutencao = _mapper.Map(
          request,
          ManutencaoInDb
        ); // map dto to domain entity

        Manutencao response = await _repository.UpdateAsync<
          Manutencao,
          Guid
        >(updatedManutencao); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        // Delete existing ManutencaoServicos
        var existingServicos = await _repository.GetListAsync<ManutencaoServico, Guid>(
          new ManutencaoServicoByManutencaoIdSpecification(id)
        );
        foreach (var servico in existingServicos)
        {
          _ = await _repository.RemoveByIdAsync<ManutencaoServico, Guid>(servico.Id);
        }
        _ = await _repository.SaveChangesAsync();

        // Create new ManutencaoServicos if provided
        if (request.Servicos != null && request.Servicos.Any())
        {
          foreach (var servicoRequest in request.Servicos)
          {
            ManutencaoServico manutencaoServico = _mapper.Map(
              servicoRequest,
              new ManutencaoServico()
            );
            manutencaoServico.ManutencaoId = id;
            _ = await _repository.CreateAsync<ManutencaoServico, Guid>(manutencaoServico);
          }
          _ = await _repository.SaveChangesAsync();
        }

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Manutencao
    public async Task<Response<Guid>> DeleteManutencaoAsync(Guid id)
    {
      try
      {
        Manutencao? Manutencao = await _repository.RemoveByIdAsync<
          Manutencao,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Manutencao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Manutencoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleManutencoesAsync(
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
            Manutencao? entity = await _repository.GetByIdAsync<
              Manutencao,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Manutenção com ID {id}");
              continue;
            }

            // Try to delete the entity
            Manutencao? deletedEntity = await _repository.RemoveByIdAsync<
              Manutencao,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Manutenção com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Manutenção com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} manutenções.";
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

