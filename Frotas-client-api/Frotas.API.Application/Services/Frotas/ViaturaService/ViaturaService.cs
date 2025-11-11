using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.Filters;
using Frotas.API.Application.Services.Frotas.ViaturaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ViaturaService
{
  public class ViaturaService : IViaturaService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public ViaturaService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    public async Task<Response<IEnumerable<ViaturaDTO>>> GetViaturasAsync(string keyword = "")
    {
      ViaturaSearchList specification = new(keyword);
      IEnumerable<ViaturaDTO> list = await _repository.GetListAsync<Viatura, ViaturaDTO, Guid>(
        specification
      );
      return Response<IEnumerable<ViaturaDTO>>.Success(list);
    }

    public async Task<PaginatedResponse<ViaturaDTO>> GetViaturasPaginatedAsync(
      ViaturaTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : "";
      ViaturaSearchTable specification = new(filter.Filters ?? [], dynamicOrder);
      PaginatedResponse<ViaturaDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<Viatura, ViaturaDTO, Guid>(
          filter.PageNumber,
          filter.PageSize,
          specification
        );
      return pagedResponse;
    }

    public async Task<Response<ViaturaDTO>> GetViaturaAsync(Guid id)
    {
      try
      {
        ViaturaDTO dto = await _repository.GetByIdAsync<Viatura, ViaturaDTO, Guid>(id);
        return Response<ViaturaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<ViaturaDTO>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> CreateViaturaAsync(CreateViaturaRequest request)
    {
      ViaturaMatchMatricula specification = new(request.Matricula);
      bool viaturaExists = await _repository.ExistsAsync<Viatura, Guid>(specification);
      if (viaturaExists)
      {
        return Response<Guid>.Fail("Viatura já existe");
      }

      Viatura newViatura = _mapper.Map<CreateViaturaRequest, Viatura>(request);

      try
      {
        Viatura response = await _repository.CreateAsync<Viatura, Guid>(newViatura);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> UpdateViaturaAsync(UpdateViaturaRequest request, Guid id)
    {
      Viatura viaturaInDb = await _repository.GetByIdAsync<Viatura, Guid>(id);
      if (viaturaInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      ViaturaMatchMatricula specification = new(request.Matricula, id);
      bool viaturaExists = await _repository.ExistsAsync<Viatura, Guid>(specification);
      if (viaturaExists)
      {
        return Response<Guid>.Fail("Já existe uma viatura com esta matrícula");
      }

      Viatura updatedViatura = _mapper.Map(request, viaturaInDb);

      try
      {
        Viatura response = await _repository.UpdateAsync<Viatura, Guid>(updatedViatura);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> DeleteViaturaAsync(Guid id)
    {
      try
      {
        Viatura? viatura = await _repository.RemoveByIdAsync<Viatura, Guid>(id);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(viatura.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleViaturasAsync(
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
            Viatura? entity = await _repository.GetByIdAsync<Viatura, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Viatura com ID {id}");
              continue;
            }

            Viatura? deletedEntity = await _repository.RemoveByIdAsync<Viatura, Guid>(id);
            if (deletedEntity != null)
            {
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Viatura com ID {id}");
            }
          }
          catch (Exception)
          {
            failedDeletions.Add($"Viatura com ID {id}");
            _repository.ClearChangeTracker();
          }
        }

        if (successfullyDeletedIds.Count == idsList.Count)
        {
          return Response<IEnumerable<Guid>>.Success(successfullyDeletedIds);
        }
        else if (successfullyDeletedIds.Count > 0)
        {
          string message = $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} viaturas.";
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

