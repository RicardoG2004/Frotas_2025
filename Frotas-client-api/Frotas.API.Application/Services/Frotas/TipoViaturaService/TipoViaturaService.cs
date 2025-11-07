using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.Filters;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService
{
  public class TipoViaturaService : ITipoViaturaService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public TipoViaturaService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    public async Task<Response<IEnumerable<TipoViaturaDTO>>> GetTipoViaturasAsync(string keyword = "")
    {
      TipoViaturaSearchList specification = new(keyword);
      IEnumerable<TipoViaturaDTO> list = await _repository.GetListAsync<TipoViatura, TipoViaturaDTO, Guid>(
        specification
      );
      return Response<IEnumerable<TipoViaturaDTO>>.Success(list);
    }

    public async Task<PaginatedResponse<TipoViaturaDTO>> GetTipoViaturasPaginatedAsync(
      TipoViaturaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : string.Empty;
      TipoViaturaSearchTable specification = new(filter.Filters ?? [], dynamicOrder);
      PaginatedResponse<TipoViaturaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        TipoViatura,
        TipoViaturaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification);
      return pagedResponse;
    }

    public async Task<Response<TipoViaturaDTO>> GetTipoViaturaAsync(Guid id)
    {
      try
      {
        TipoViaturaDTO dto = await _repository.GetByIdAsync<TipoViatura, TipoViaturaDTO, Guid>(id);
        return Response<TipoViaturaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<TipoViaturaDTO>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> CreateTipoViaturaAsync(CreateTipoViaturaRequest request)
    {
      TipoViaturaMatchName specification = new(request.Designacao);
      bool tipoViaturaExists = await _repository.ExistsAsync<TipoViatura, Guid>(specification);
      if (tipoViaturaExists)
      {
        return Response<Guid>.Fail("Já existe um tipo de viatura com a designação especificada");
      }

      TipoViatura newTipoViatura = _mapper.Map(request, new TipoViatura());

      try
      {
        TipoViatura response = await _repository.CreateAsync<TipoViatura, Guid>(newTipoViatura);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> UpdateTipoViaturaAsync(UpdateTipoViaturaRequest request, Guid id)
    {
      TipoViatura tipoViaturaInDb = await _repository.GetByIdAsync<TipoViatura, Guid>(id);
      if (tipoViaturaInDb == null)
      {
        return Response<Guid>.Fail("Tipo de viatura não encontrada");
      }

      TipoViatura updatedTipoViatura = _mapper.Map(request, tipoViaturaInDb);

      try
      {
        TipoViatura response = await _repository.UpdateAsync<TipoViatura, Guid>(updatedTipoViatura);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> DeleteTipoViaturaAsync(Guid id)
    {
      try
      {
        TipoViatura? tipoViatura = await _repository.RemoveByIdAsync<TipoViatura, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(tipoViatura.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleTipoViaturasAsync(IEnumerable<Guid> ids)
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
            TipoViatura? entity = await _repository.GetByIdAsync<TipoViatura, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Tipo de viatura com ID {id}");
              continue;
            }

            TipoViatura? deletedEntity = await _repository.RemoveByIdAsync<TipoViatura, Guid>(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Tipo de viatura com ID {id}");
            }
          }
          catch (Exception)
          {
            failedDeletions.Add($"Tipo de viatura com ID {id}");
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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} tipos de viatura.";
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