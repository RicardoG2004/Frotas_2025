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
        ViaturaWithDetalhesSpecification specification = new(id);
        ViaturaDTO dto = await _repository.GetByIdAsync<Viatura, ViaturaDTO, Guid>(
          id,
          specification
        );
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

      NormalizeEntidadeFornecedora(request);
      Viatura newViatura = _mapper.Map<CreateViaturaRequest, Viatura>(request);
      SyncEquipamentos(newViatura, request.EquipamentoIds);
      SyncGarantias(newViatura, request.GarantiaIds);
      SyncSeguros(newViatura, request.SeguroIds);
      SyncInspecoes(newViatura, request.Inspecoes);

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
      ViaturaWithDetalhesSpecification specification = new(id);
      Viatura viaturaInDb = await _repository.GetByIdAsync<Viatura, Guid>(id, specification);
      if (viaturaInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      ViaturaMatchMatricula matriculaSpecification = new(request.Matricula, id);
      bool viaturaExists = await _repository.ExistsAsync<Viatura, Guid>(matriculaSpecification);
      if (viaturaExists)
      {
        return Response<Guid>.Fail("Já existe uma viatura com esta matrícula");
      }

      NormalizeEntidadeFornecedora(request);
      Viatura updatedViatura = _mapper.Map(request, viaturaInDb);
      SyncEquipamentos(updatedViatura, request.EquipamentoIds);
      SyncGarantias(updatedViatura, request.GarantiaIds);
      SyncSeguros(updatedViatura, request.SeguroIds);
      SyncInspecoes(updatedViatura, request.Inspecoes);

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

  private static void SyncEquipamentos(Viatura viatura, ICollection<Guid> equipamentoIds)
  {
    equipamentoIds ??= new List<Guid>();
    viatura.ViaturaEquipamentos ??= new List<ViaturaEquipamento>();

    HashSet<Guid> desiredIds = equipamentoIds.ToHashSet();
    List<ViaturaEquipamento> toRemove = viatura.ViaturaEquipamentos
      .Where(ve => !desiredIds.Contains(ve.EquipamentoId))
      .ToList();

    foreach (ViaturaEquipamento item in toRemove)
    {
      _ = viatura.ViaturaEquipamentos.Remove(item);
    }

    HashSet<Guid> existingIds = viatura.ViaturaEquipamentos
      .Select(ve => ve.EquipamentoId)
      .ToHashSet();

    foreach (Guid equipamentoId in desiredIds)
    {
      if (!existingIds.Contains(equipamentoId))
      {
        viatura.ViaturaEquipamentos.Add(
          new ViaturaEquipamento { EquipamentoId = equipamentoId }
        );
      }
    }
  }

  private static void SyncSeguros(Viatura viatura, ICollection<Guid> seguroIds)
  {
    seguroIds ??= new List<Guid>();
    viatura.ViaturaSeguros ??= new List<ViaturaSeguro>();

    HashSet<Guid> desiredIds = seguroIds.ToHashSet();
    List<ViaturaSeguro> toRemove = viatura.ViaturaSeguros
      .Where(vs => !desiredIds.Contains(vs.SeguroId))
      .ToList();

    foreach (ViaturaSeguro item in toRemove)
    {
      _ = viatura.ViaturaSeguros.Remove(item);
    }

    HashSet<Guid> existingIds = viatura.ViaturaSeguros
      .Select(vs => vs.SeguroId)
      .ToHashSet();

    foreach (Guid seguroId in desiredIds)
    {
      if (!existingIds.Contains(seguroId))
      {
        viatura.ViaturaSeguros.Add(new ViaturaSeguro { SeguroId = seguroId });
      }
    }
  }

  private static void SyncGarantias(Viatura viatura, ICollection<Guid> garantiaIds)
  {
    garantiaIds ??= new List<Guid>();
    viatura.ViaturaGarantias ??= new List<ViaturaGarantia>();

    HashSet<Guid> desiredIds = garantiaIds.ToHashSet();
    List<ViaturaGarantia> toRemove = viatura.ViaturaGarantias
      .Where(vg => !desiredIds.Contains(vg.GarantiaId))
      .ToList();

    foreach (ViaturaGarantia item in toRemove)
    {
      _ = viatura.ViaturaGarantias.Remove(item);
    }

    HashSet<Guid> existingIds = viatura.ViaturaGarantias
      .Select(vg => vg.GarantiaId)
      .ToHashSet();

    foreach (Guid garantiaId in desiredIds)
    {
      if (!existingIds.Contains(garantiaId))
      {
        viatura.ViaturaGarantias.Add(new ViaturaGarantia { GarantiaId = garantiaId });
      }
    }
  }

  private static void SyncInspecoes(
    Viatura viatura,
    ICollection<ViaturaInspecaoUpsertDTO> inspeccoesRequest
  )
  {
    inspeccoesRequest ??= new List<ViaturaInspecaoUpsertDTO>();
    viatura.ViaturaInspecoes ??= new List<ViaturaInspecao>();

    HashSet<Guid> incomingIds = inspeccoesRequest
      .Where(i => i.Id.HasValue)
      .Select(i => i.Id!.Value)
      .ToHashSet();

    List<ViaturaInspecao> toRemove = viatura.ViaturaInspecoes
      .Where(inspecao => !incomingIds.Contains(inspecao.Id))
      .ToList();

    foreach (ViaturaInspecao inspecao in toRemove)
    {
      _ = viatura.ViaturaInspecoes.Remove(inspecao);
    }

    foreach (ViaturaInspecaoUpsertDTO requestInspecao in inspeccoesRequest)
    {
      if (requestInspecao.Id.HasValue)
      {
        ViaturaInspecao? existing = viatura.ViaturaInspecoes.FirstOrDefault(
          inspecao => inspecao.Id == requestInspecao.Id.Value
        );

        if (existing != null)
        {
          existing.DataInspecao = requestInspecao.DataInspecao;
          existing.Resultado = requestInspecao.Resultado;
          existing.DataProximaInspecao = requestInspecao.DataProximaInspecao;
          continue;
        }
      }

      viatura.ViaturaInspecoes.Add(
        new ViaturaInspecao
        {
          Id = requestInspecao.Id ?? Guid.NewGuid(),
          DataInspecao = requestInspecao.DataInspecao,
          Resultado = requestInspecao.Resultado,
          DataProximaInspecao = requestInspecao.DataProximaInspecao,
        }
      );
    }
  }

  private static void NormalizeEntidadeFornecedora(CreateViaturaRequest request)
  {
    if (request == null)
    {
      return;
    }

    request.EntidadeFornecedoraTipo = NormalizeEntidadeFornecedoraTipo(request.EntidadeFornecedoraTipo);
    if (request.EntidadeFornecedoraTipo == "fornecedor")
    {
      request.TerceiroId = null;
    }
    else
    {
      request.FornecedorId = null;
    }
  }

  private static void NormalizeEntidadeFornecedora(UpdateViaturaRequest request)
  {
    if (request == null)
    {
      return;
    }

    request.EntidadeFornecedoraTipo = NormalizeEntidadeFornecedoraTipo(request.EntidadeFornecedoraTipo);
    if (request.EntidadeFornecedoraTipo == "fornecedor")
    {
      request.TerceiroId = null;
    }
    else
    {
      request.FornecedorId = null;
    }
  }

  private static string NormalizeEntidadeFornecedoraTipo(string? tipo)
  {
    return string.Equals(tipo?.Trim(), "terceiro", StringComparison.OrdinalIgnoreCase)
      ? "terceiro"
      : "fornecedor";
  }
  }
}

