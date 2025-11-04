using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.Filters;
using Frotas.API.Application.Services.Frotas.ServicoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ServicoService
{
  public class ServicoService(IRepositoryAsync repository, IMapper mapper)
    : IServicoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<ServicoDTO>>> GetServicosAsync(string keyword = "")
    {
      ServicoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<ServicoDTO> list = await _repository.GetListAsync<
        Servico,
        ServicoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<ServicoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<ServicoDTO>> GetServicosPaginatedAsync(ServicoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      ServicoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<ServicoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Servico,
          ServicoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Servico by Id
    public async Task<Response<ServicoDTO>> GetServicoAsync(
      Guid id
    )
    {
      try
      {
        ServicoDTO dto = await _repository.GetByIdAsync<
          Servico,
          ServicoDTO,
          Guid
        >(id);
        return Response<ServicoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ServicoDTO>.Fail(ex.Message);
      }
    }

    // create new Servico
    public async Task<Response<Guid>> CreateServicoAsync(
      CreateServicoRequest request
    )
    {
      try
      {
        // Check if Designacao is already associated with a servico
        IEnumerable<Servico> existingServicos =
          await _repository.GetListAsync<Servico, Guid>(
            new ServicoMatchName(request.Designacao)
          );
        Servico? existingServico =
          existingServicos.FirstOrDefault();
        if (existingServico != null)
        {
          return Response<Guid>.Fail("Já existe um serviço associado a esta designacao.");
        }

        Servico newServico = _mapper.Map(
          request,
          new Servico()
        ); // map dto to domain entity

        // Calculate CustoTotal based on Custo and TaxaIva
        if (request.TaxaIvaId.HasValue && request.TaxaIvaId.Value != Guid.Empty)
        {
          TaxaIva? taxaIva = await _repository.GetByIdAsync<TaxaIva, Guid>(request.TaxaIvaId.Value);
          if (taxaIva != null)
          {
            decimal valorIva = (newServico.Custo * taxaIva.Valor) / 100;
            newServico.CustoTotal = newServico.Custo + valorIva;
          }
          else
          {
            newServico.CustoTotal = newServico.Custo;
          }
        }
        else
        {
          newServico.CustoTotal = newServico.Custo;
        }

        Servico response = await _repository.CreateAsync<
          Servico,
          Guid
        >(newServico); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Servico
    public async Task<Response<Guid>> UpdateServicoAsync(
      UpdateServicoRequest request,
      Guid id
    )
    {
      try
      {
        Servico ServicoInDb = await _repository.GetByIdAsync<
          Servico,
          Guid
        >(id); // get existing entity
        if (ServicoInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if Designacao is already associated with another servico
        IEnumerable<Servico> existingServicos =
          await _repository.GetListAsync<Servico, Guid>(
            new ServicoMatchName(request.Designacao)
          );
        Servico? existingServico =
          existingServicos.FirstOrDefault();
        if (existingServico != null && existingServico.Id != id)
        {
          return Response<Guid>.Fail("Já existe um serviço associado a esta designacao.");
        }

        Servico updatedServico = _mapper.Map(
          request,
          ServicoInDb
        ); // map dto to domain entity

        // Calculate CustoTotal based on Custo and TaxaIva
        if (request.TaxaIvaId.HasValue && request.TaxaIvaId.Value != Guid.Empty)
        {
          TaxaIva? taxaIva = await _repository.GetByIdAsync<TaxaIva, Guid>(request.TaxaIvaId.Value);
          if (taxaIva != null)
          {
            decimal valorIva = (updatedServico.Custo * taxaIva.Valor) / 100;
            updatedServico.CustoTotal = updatedServico.Custo + valorIva;
          }
          else
          {
            updatedServico.CustoTotal = updatedServico.Custo;
          }
        }
        else
        {
          updatedServico.CustoTotal = updatedServico.Custo;
        }

        Servico response = await _repository.UpdateAsync<
          Servico,
          Guid
        >(updatedServico); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Servico
    public async Task<Response<Guid>> DeleteServicoAsync(Guid id)
    {
      try
      {
        Servico? Servico = await _repository.RemoveByIdAsync<
          Servico,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Servico.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Servicos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleServicosAsync(
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
            Servico? entity = await _repository.GetByIdAsync<
              Servico,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Serviço com ID {id}");
              continue;
            }

            // Try to delete the entity
            Servico? deletedEntity = await _repository.RemoveByIdAsync<
              Servico,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Serviço com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Serviço com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} serviços.";
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

