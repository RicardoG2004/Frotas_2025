using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.Filters;
using Frotas.API.Application.Services.Frotas.AbastecimentoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService
{
  public class AbastecimentoService(IRepositoryAsync repository, IMapper mapper)
    : IAbastecimentoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosAsync(string keyword = "")
    {
      AbastecimentoSearchList specification = new(keyword);
      IEnumerable<AbastecimentoDTO> list = await _repository.GetListAsync<
        Abastecimento,
        AbastecimentoDTO,
        Guid
      >(specification);
      return Response<IEnumerable<AbastecimentoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list
    public async Task<PaginatedResponse<AbastecimentoDTO>> GetAbastecimentosPaginatedAsync(AbastecimentoTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : "";
      AbastecimentoSearchTable specification = new(filter.Filters ?? [], dynamicOrder);
      PaginatedResponse<AbastecimentoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Abastecimento,
          AbastecimentoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification);
      return pagedResponse;
    }

    // get single Abastecimento by Id
    public async Task<Response<AbastecimentoDTO>> GetAbastecimentoAsync(
      Guid id
    )
    {
      try
      {
        AbastecimentoDTO dto = await _repository.GetByIdAsync<
          Abastecimento,
          AbastecimentoDTO,
          Guid
        >(id);
        return Response<AbastecimentoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<AbastecimentoDTO>.Fail(ex.Message);
      }
    }

    // get Abastecimentos by Funcionario
    public async Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosByFuncionarioAsync(Guid funcionarioId)
    {
      try
      {
        AbastecimentoByFuncionarioSpecification specification = new(funcionarioId);
        IEnumerable<AbastecimentoDTO> list = await _repository.GetListAsync<
          Abastecimento,
          AbastecimentoDTO,
          Guid
        >(specification);
        return Response<IEnumerable<AbastecimentoDTO>>.Success(list);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<AbastecimentoDTO>>.Fail(ex.Message);
      }
    }

    // get Abastecimentos by Date
    public async Task<Response<IEnumerable<AbastecimentoDTO>>> GetAbastecimentosByDateAsync(DateTime data)
    {
      try
      {
        AbastecimentoSearchList specification = new("");
        IEnumerable<Abastecimento> abastecimentos = await _repository.GetListAsync<Abastecimento, Guid>(specification);
        IEnumerable<AbastecimentoDTO> abastecimentosFiltrados = _mapper.Map<IEnumerable<AbastecimentoDTO>>(
          abastecimentos.Where(a => a.Data.Date == data.Date)
                   .OrderByDescending(a => a.Data)
        );
        return Response<IEnumerable<AbastecimentoDTO>>.Success(abastecimentosFiltrados);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<AbastecimentoDTO>>.Fail(ex.Message);
      }
    }

    // create new Abastecimento
    public async Task<Response<Guid>> CreateAbastecimentoAsync(
      CreateAbastecimentoRequest request
    )
    {
      try
      {
        // Create entity manually
        Abastecimento newAbastecimento = new()
        {
          Data = request.Data,
          FuncionarioId = request.FuncionarioId,
          ViaturaId = request.ViaturaId,
          Kms = request.Kms,
          Litros = request.Litros,
          Valor = request.Valor,
        };

        Abastecimento response = await _repository.CreateAsync<
          Abastecimento,
          Guid
        >(newAbastecimento);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Erro ao criar abastecimento: {ex.Message}. StackTrace: {ex.StackTrace}");
      }
    }

    // update Abastecimento
    public async Task<Response<Guid>> UpdateAbastecimentoAsync(
      UpdateAbastecimentoRequest request,
      Guid id
    )
    {
      try
      {
        Abastecimento AbastecimentoInDb = await _repository.GetByIdAsync<
          Abastecimento,
          Guid
        >(id);
        if (AbastecimentoInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        Abastecimento updatedAbastecimento = _mapper.Map(
          request,
          AbastecimentoInDb
        );

        Abastecimento response = await _repository.UpdateAsync<
          Abastecimento,
          Guid
        >(updatedAbastecimento);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Abastecimento
    public async Task<Response<Guid>> DeleteAbastecimentoAsync(Guid id)
    {
      try
      {
        Abastecimento? Abastecimento = await _repository.RemoveByIdAsync<
          Abastecimento,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Abastecimento.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Abastecimentos
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleAbastecimentosAsync(
      IEnumerable<Guid> ids
    )
    {
      try
      {
        List<Guid> idsList = ids.ToList();
        List<Guid> successfullyDeletedIds = [];
        List<string> failedDeletions = [];

        foreach (Guid id in idsList)
        {
          try
          {
            Abastecimento? entity = await _repository.GetByIdAsync<
              Abastecimento,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Abastecimento com ID {id}");
              continue;
            }

            Abastecimento? deletedEntity = await _repository.RemoveByIdAsync<
              Abastecimento,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Abastecimento com ID {id}");
            }
          }
          catch (Exception ex)
          {
            failedDeletions.Add($"Abastecimento com ID {id}");

            _repository.ClearChangeTracker();
          }
        }

        if (successfullyDeletedIds.Count == idsList.Count)
        {
          return Response<IEnumerable<Guid>>.Success(successfullyDeletedIds);
        }
        else if (successfullyDeletedIds.Count > 0)
        {
          string message =
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} abastecimentos.";
          return Response<IEnumerable<Guid>>.PartialSuccess(successfullyDeletedIds, message);
        }
        else
        {
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

