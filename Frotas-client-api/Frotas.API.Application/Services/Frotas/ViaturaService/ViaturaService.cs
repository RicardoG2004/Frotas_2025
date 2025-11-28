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
      
      // Normalizar todos os foreign keys opcionais: converter Guid.Empty para null
      NormalizeOptionalForeignKeys(request);
      
      Viatura newViatura = _mapper.Map<CreateViaturaRequest, Viatura>(request);
      
      // Aplicar normalização após o mapeamento também
      NormalizeOptionalForeignKeysOnEntity(newViatura);
      
      SyncEquipamentos(newViatura, request.EquipamentoIds);
      SyncGarantias(newViatura, request.GarantiaIds);
      SyncSeguros(newViatura, request.SeguroIds);
      SyncCondutores(newViatura, request.CondutorIds);
      SyncInspecoes(newViatura, request.Inspecoes);
      SyncAcidentes(newViatura, request.Acidentes);
      SyncMultas(newViatura, request.Multas);

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
      
      NormalizeEntidadeFornecedora(request);
      
      // Normalizar todos os foreign keys opcionais: converter Guid.Empty para null
      NormalizeOptionalForeignKeys(request);
      
      // Mapear o request diretamente para a entidade já carregada
      // Isso mantém as navegações no contexto do Entity Framework
      _mapper.Map(request, viaturaInDb);
      
      // Garantir que null seja aplicado para MarcaId e ModeloId e limpar navegações
      viaturaInDb.MarcaId = request.MarcaId;
      viaturaInDb.ModeloId = request.ModeloId;
      
      // Aplicar normalização após o mapeamento também
      NormalizeOptionalForeignKeysOnEntity(viaturaInDb);
      
      // Limpar todas as navegações quando os IDs forem null
      ClearNavigationPropertiesWhenNull(viaturaInDb);
      
      SyncEquipamentos(viaturaInDb, request.EquipamentoIds);
      SyncGarantias(viaturaInDb, request.GarantiaIds);
      SyncSeguros(viaturaInDb, request.SeguroIds);
      SyncCondutores(viaturaInDb, request.CondutorIds);
      SyncInspecoes(viaturaInDb, request.Inspecoes);
      SyncAcidentes(viaturaInDb, request.Acidentes);
      SyncMultas(viaturaInDb, request.Multas);

      try
      {
        // Log antes do update
        string marcaLog = viaturaInDb.MarcaId?.ToString() ?? "null";
        string modeloLog = viaturaInDb.ModeloId?.ToString() ?? "null";
        
        // Usar a entidade já carregada e rastreada pelo Entity Framework
        // Marcar como modificada explicitamente
        Viatura response = await _repository.UpdateAsync<Viatura, Guid>(viaturaInDb);
        
        // Log antes do SaveChanges
        string marcaLogAfter = response.MarcaId?.ToString() ?? "null";
        string modeloLogAfter = response.ModeloId?.ToString() ?? "null";
        
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        string errorMessage = "Erro ao salvar viatura: " + ex.Message;
        string fullDetails = $"Tipo: {ex.GetType().Name}, Mensagem: {ex.Message}";
        
        if (ex.InnerException != null)
        {
          errorMessage += " | Inner Exception: " + ex.InnerException.Message;
          fullDetails += $", Inner Tipo: {ex.InnerException.GetType().Name}, Inner Mensagem: {ex.InnerException.Message}";
          
          // Verificar se é um erro do Entity Framework
          if (ex.InnerException is Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
          {
            fullDetails += $", DbUpdateException: {dbEx.Message}";
            if (dbEx.InnerException != null)
            {
              fullDetails += $", DbUpdate Inner: {dbEx.InnerException.Message}";
            }
          }
        }
        
        if (!string.IsNullOrEmpty(ex.StackTrace))
        {
          fullDetails += $", StackTrace (primeiros 300 chars): {ex.StackTrace.Substring(0, Math.Min(300, ex.StackTrace.Length))}";
        }
        
        return Response<Guid>.Fail(fullDetails);
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

  private static void SyncCondutores(Viatura viatura, ICollection<Guid> condutorIds)
  {
    condutorIds ??= new List<Guid>();
    viatura.ViaturaCondutores ??= new List<ViaturaCondutor>();

    HashSet<Guid> desiredIds = condutorIds.ToHashSet();
    List<ViaturaCondutor> toRemove = viatura.ViaturaCondutores
      .Where(vc => !desiredIds.Contains(vc.FuncionarioId))
      .ToList();

    foreach (ViaturaCondutor item in toRemove)
    {
      _ = viatura.ViaturaCondutores.Remove(item);
    }

    HashSet<Guid> existingIds = viatura.ViaturaCondutores
      .Select(vc => vc.FuncionarioId)
      .ToHashSet();

    foreach (Guid condutorId in desiredIds)
    {
      if (!existingIds.Contains(condutorId))
      {
        viatura.ViaturaCondutores.Add(new ViaturaCondutor { FuncionarioId = condutorId });
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

      var newInspecao = new ViaturaInspecao
      {
        Id = requestInspecao.Id ?? Guid.NewGuid(),
        DataInspecao = requestInspecao.DataInspecao,
        Resultado = requestInspecao.Resultado,
        DataProximaInspecao = requestInspecao.DataProximaInspecao,
      };
      if (viatura.Id != Guid.Empty)
      {
        newInspecao.ViaturaId = viatura.Id;
      }
      viatura.ViaturaInspecoes.Add(newInspecao);
    }
  }

  private static void SyncAcidentes(
    Viatura viatura,
    ICollection<ViaturaAcidenteUpsertDTO> acidentesRequest
  )
  {
    acidentesRequest ??= new List<ViaturaAcidenteUpsertDTO>();
    viatura.ViaturaAcidentes ??= new List<ViaturaAcidente>();

    HashSet<Guid> incomingIds = acidentesRequest
      .Where(a => a.Id.HasValue)
      .Select(a => a.Id!.Value)
      .ToHashSet();

    List<ViaturaAcidente> toRemove = viatura.ViaturaAcidentes
      .Where(acidente => !incomingIds.Contains(acidente.Id))
      .ToList();

    foreach (ViaturaAcidente acidente in toRemove)
    {
      _ = viatura.ViaturaAcidentes.Remove(acidente);
    }

    foreach (ViaturaAcidenteUpsertDTO requestAcidente in acidentesRequest)
    {
      if (requestAcidente.Id.HasValue)
      {
        ViaturaAcidente? existing = viatura.ViaturaAcidentes.FirstOrDefault(
          acidente => acidente.Id == requestAcidente.Id.Value
        );

        if (existing != null)
        {
          existing.FuncionarioId = requestAcidente.FuncionarioId;
          existing.DataHora = requestAcidente.DataHora;
          existing.Hora = requestAcidente.Hora;
          existing.Culpa = requestAcidente.Culpa;
          existing.DescricaoAcidente = requestAcidente.DescricaoAcidente;
          existing.DescricaoDanos = requestAcidente.DescricaoDanos;
          existing.Local = requestAcidente.Local;
          existing.ConcelhoId = requestAcidente.ConcelhoId;
          existing.FreguesiaId = requestAcidente.FreguesiaId;
          existing.CodigoPostalId = requestAcidente.CodigoPostalId;
          existing.LocalReparacao = requestAcidente.LocalReparacao;
          continue;
        }
      }

      var newAcidente = new ViaturaAcidente
      {
        Id = requestAcidente.Id ?? Guid.NewGuid(),
        FuncionarioId = requestAcidente.FuncionarioId,
        DataHora = requestAcidente.DataHora,
        Hora = requestAcidente.Hora,
        Culpa = requestAcidente.Culpa,
        DescricaoAcidente = requestAcidente.DescricaoAcidente,
        DescricaoDanos = requestAcidente.DescricaoDanos,
        Local = requestAcidente.Local,
        ConcelhoId = requestAcidente.ConcelhoId,
        FreguesiaId = requestAcidente.FreguesiaId,
        CodigoPostalId = requestAcidente.CodigoPostalId,
        LocalReparacao = requestAcidente.LocalReparacao,
      };
      if (viatura.Id != Guid.Empty)
      {
        newAcidente.ViaturaId = viatura.Id;
      }
      viatura.ViaturaAcidentes.Add(newAcidente);
    }
  }

  private static void SyncMultas(
    Viatura viatura,
    ICollection<ViaturaMultaUpsertDTO> multasRequest
  )
  {
    multasRequest ??= new List<ViaturaMultaUpsertDTO>();
    viatura.ViaturaMultas ??= new List<ViaturaMulta>();

    HashSet<Guid> incomingIds = multasRequest
      .Where(m => m.Id.HasValue)
      .Select(m => m.Id!.Value)
      .ToHashSet();

    List<ViaturaMulta> toRemove = viatura.ViaturaMultas
      .Where(multa => !incomingIds.Contains(multa.Id))
      .ToList();

    foreach (ViaturaMulta multa in toRemove)
    {
      _ = viatura.ViaturaMultas.Remove(multa);
    }

    foreach (ViaturaMultaUpsertDTO requestMulta in multasRequest)
    {
      if (requestMulta.Id.HasValue)
      {
        ViaturaMulta? existing = viatura.ViaturaMultas.FirstOrDefault(
          multa => multa.Id == requestMulta.Id.Value
        );

        if (existing != null)
        {
          existing.FuncionarioId = requestMulta.FuncionarioId;
          existing.DataHora = requestMulta.DataHora;
          existing.Hora = requestMulta.Hora;
          existing.Local = requestMulta.Local;
          existing.Motivo = requestMulta.Motivo;
          existing.Valor = requestMulta.Valor;
          continue;
        }
      }

      var newMulta = new ViaturaMulta
      {
        Id = requestMulta.Id ?? Guid.NewGuid(),
        FuncionarioId = requestMulta.FuncionarioId,
        DataHora = requestMulta.DataHora,
        Hora = requestMulta.Hora,
        Local = requestMulta.Local,
        Motivo = requestMulta.Motivo,
        Valor = requestMulta.Valor,
      };
      if (viatura.Id != Guid.Empty)
      {
        newMulta.ViaturaId = viatura.Id;
      }
      viatura.ViaturaMultas.Add(newMulta);
    }
  }


  private static void NormalizeEntidadeFornecedora(CreateViaturaRequest request)
  {
    if (request == null)
    {
      return;
    }

    string? tipo = NormalizeEntidadeFornecedoraTipo(request.EntidadeFornecedoraTipo);
    
    // Verificar se o tipo corresponde ao ID preenchido
    if (!string.IsNullOrWhiteSpace(tipo))
    {
      if (tipo == "fornecedor")
      {
        // Se o tipo é "fornecedor" mas não tem FornecedorId válido, limpar o tipo
        if (!request.FornecedorId.HasValue || request.FornecedorId == Guid.Empty)
        {
          tipo = null;
        }
        else
        {
          request.TerceiroId = null;
        }
      }
      else if (tipo == "terceiro")
      {
        // Se o tipo é "terceiro" mas não tem TerceiroId válido, limpar o tipo
        if (!request.TerceiroId.HasValue || request.TerceiroId == Guid.Empty)
        {
          tipo = null;
        }
        else
        {
          request.FornecedorId = null;
        }
      }
    }
    
    request.EntidadeFornecedoraTipo = tipo;
    
    // Se não há tipo definido após normalização, limpar ambos os IDs
    if (string.IsNullOrWhiteSpace(request.EntidadeFornecedoraTipo))
    {
      request.TerceiroId = null;
      request.FornecedorId = null;
    }
  }

  private static void NormalizeEntidadeFornecedora(UpdateViaturaRequest request)
  {
    if (request == null)
    {
      return;
    }

    string? tipo = NormalizeEntidadeFornecedoraTipo(request.EntidadeFornecedoraTipo);
    
    // Verificar se o tipo corresponde ao ID preenchido
    if (!string.IsNullOrWhiteSpace(tipo))
    {
      if (tipo == "fornecedor")
      {
        // Se o tipo é "fornecedor" mas não tem FornecedorId válido, limpar o tipo
        if (!request.FornecedorId.HasValue || request.FornecedorId == Guid.Empty)
        {
          tipo = null;
        }
        else
        {
          request.TerceiroId = null;
        }
      }
      else if (tipo == "terceiro")
      {
        // Se o tipo é "terceiro" mas não tem TerceiroId válido, limpar o tipo
        if (!request.TerceiroId.HasValue || request.TerceiroId == Guid.Empty)
        {
          tipo = null;
        }
        else
        {
          request.FornecedorId = null;
        }
      }
    }
    
    request.EntidadeFornecedoraTipo = tipo;
    
    // Se não há tipo definido após normalização, limpar ambos os IDs
    if (string.IsNullOrWhiteSpace(request.EntidadeFornecedoraTipo))
    {
      request.TerceiroId = null;
      request.FornecedorId = null;
    }
  }

  private static string? NormalizeEntidadeFornecedoraTipo(string? tipo)
  {
    if (string.IsNullOrWhiteSpace(tipo))
    {
      return null;
    }

    string trimmed = tipo.Trim();
    
    // Se for explicitamente "terceiro", retornar "terceiro"
    if (string.Equals(trimmed, "terceiro", StringComparison.OrdinalIgnoreCase))
    {
      return "terceiro";
    }
    
    // Se for explicitamente "fornecedor", retornar "fornecedor"
    if (string.Equals(trimmed, "fornecedor", StringComparison.OrdinalIgnoreCase))
    {
      return "fornecedor";
    }
    
    // Qualquer outro valor é tratado como null (vazio)
    return null;
  }

  private static void NormalizeOptionalForeignKeys(UpdateViaturaRequest request)
  {
    if (request == null) return;

    // Converter Guid.Empty para null em todos os foreign keys opcionais
    request.MarcaId = request.MarcaId.HasValue && request.MarcaId.Value != Guid.Empty ? request.MarcaId : null;
    request.ModeloId = request.ModeloId.HasValue && request.ModeloId.Value != Guid.Empty ? request.ModeloId : null;
    request.TipoViaturaId = request.TipoViaturaId.HasValue && request.TipoViaturaId.Value != Guid.Empty ? request.TipoViaturaId : null;
    request.CorId = request.CorId.HasValue && request.CorId.Value != Guid.Empty ? request.CorId : null;
    request.CombustivelId = request.CombustivelId.HasValue && request.CombustivelId.Value != Guid.Empty ? request.CombustivelId : null;
    request.ConservatoriaId = request.ConservatoriaId.HasValue && request.ConservatoriaId.Value != Guid.Empty ? request.ConservatoriaId : null;
    request.CategoriaId = request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty ? request.CategoriaId : null;
    request.LocalizacaoId = request.LocalizacaoId.HasValue && request.LocalizacaoId.Value != Guid.Empty ? request.LocalizacaoId : null;
    request.SetorId = request.SetorId.HasValue && request.SetorId.Value != Guid.Empty ? request.SetorId : null;
    request.DelegacaoId = request.DelegacaoId.HasValue && request.DelegacaoId.Value != Guid.Empty ? request.DelegacaoId : null;
    request.TerceiroId = request.TerceiroId.HasValue && request.TerceiroId.Value != Guid.Empty ? request.TerceiroId : null;
    request.FornecedorId = request.FornecedorId.HasValue && request.FornecedorId.Value != Guid.Empty ? request.FornecedorId : null;
  }

  private static void NormalizeOptionalForeignKeys(CreateViaturaRequest request)
  {
    if (request == null) return;

    // Converter Guid.Empty para null em todos os foreign keys opcionais
    request.MarcaId = request.MarcaId.HasValue && request.MarcaId.Value != Guid.Empty ? request.MarcaId : null;
    request.ModeloId = request.ModeloId.HasValue && request.ModeloId.Value != Guid.Empty ? request.ModeloId : null;
    request.TipoViaturaId = request.TipoViaturaId.HasValue && request.TipoViaturaId.Value != Guid.Empty ? request.TipoViaturaId : null;
    request.CorId = request.CorId.HasValue && request.CorId.Value != Guid.Empty ? request.CorId : null;
    request.CombustivelId = request.CombustivelId.HasValue && request.CombustivelId.Value != Guid.Empty ? request.CombustivelId : null;
    request.ConservatoriaId = request.ConservatoriaId.HasValue && request.ConservatoriaId.Value != Guid.Empty ? request.ConservatoriaId : null;
    request.CategoriaId = request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty ? request.CategoriaId : null;
    request.LocalizacaoId = request.LocalizacaoId.HasValue && request.LocalizacaoId.Value != Guid.Empty ? request.LocalizacaoId : null;
    request.SetorId = request.SetorId.HasValue && request.SetorId.Value != Guid.Empty ? request.SetorId : null;
    request.DelegacaoId = request.DelegacaoId.HasValue && request.DelegacaoId.Value != Guid.Empty ? request.DelegacaoId : null;
    request.TerceiroId = request.TerceiroId.HasValue && request.TerceiroId.Value != Guid.Empty ? request.TerceiroId : null;
    request.FornecedorId = request.FornecedorId.HasValue && request.FornecedorId.Value != Guid.Empty ? request.FornecedorId : null;
  }

  private static void NormalizeOptionalForeignKeysOnEntity(Viatura viatura)
  {
    if (viatura == null) return;

    // Converter Guid.Empty para null em todos os foreign keys opcionais
    viatura.MarcaId = viatura.MarcaId.HasValue && viatura.MarcaId.Value != Guid.Empty ? viatura.MarcaId : null;
    viatura.ModeloId = viatura.ModeloId.HasValue && viatura.ModeloId.Value != Guid.Empty ? viatura.ModeloId : null;
    viatura.TipoViaturaId = viatura.TipoViaturaId.HasValue && viatura.TipoViaturaId.Value != Guid.Empty ? viatura.TipoViaturaId : null;
    viatura.CorId = viatura.CorId.HasValue && viatura.CorId.Value != Guid.Empty ? viatura.CorId : null;
    viatura.CombustivelId = viatura.CombustivelId.HasValue && viatura.CombustivelId.Value != Guid.Empty ? viatura.CombustivelId : null;
    viatura.ConservatoriaId = viatura.ConservatoriaId.HasValue && viatura.ConservatoriaId.Value != Guid.Empty ? viatura.ConservatoriaId : null;
    viatura.CategoriaId = viatura.CategoriaId.HasValue && viatura.CategoriaId.Value != Guid.Empty ? viatura.CategoriaId : null;
    viatura.LocalizacaoId = viatura.LocalizacaoId.HasValue && viatura.LocalizacaoId.Value != Guid.Empty ? viatura.LocalizacaoId : null;
    viatura.SetorId = viatura.SetorId.HasValue && viatura.SetorId.Value != Guid.Empty ? viatura.SetorId : null;
    viatura.DelegacaoId = viatura.DelegacaoId.HasValue && viatura.DelegacaoId.Value != Guid.Empty ? viatura.DelegacaoId : null;
    viatura.TerceiroId = viatura.TerceiroId.HasValue && viatura.TerceiroId.Value != Guid.Empty ? viatura.TerceiroId : null;
    viatura.FornecedorId = viatura.FornecedorId.HasValue && viatura.FornecedorId.Value != Guid.Empty ? viatura.FornecedorId : null;
  }

  private static void ClearNavigationPropertiesWhenNull(Viatura viatura)
  {
    if (viatura == null) return;

    // Limpar todas as navegações quando os IDs forem null
    if (viatura.MarcaId == null) viatura.Marca = null;
    if (viatura.ModeloId == null) viatura.Modelo = null;
    if (viatura.TipoViaturaId == null) viatura.TipoViatura = null;
    if (viatura.CorId == null) viatura.Cor = null;
    if (viatura.CombustivelId == null) viatura.Combustivel = null;
    if (viatura.ConservatoriaId == null) viatura.Conservatoria = null;
    if (viatura.CategoriaId == null) viatura.Categoria = null;
    if (viatura.LocalizacaoId == null) viatura.Localizacao = null;
    if (viatura.SetorId == null) viatura.Setor = null;
    if (viatura.DelegacaoId == null) viatura.Delegacao = null;
    if (viatura.TerceiroId == null) viatura.Terceiro = null;
    if (viatura.FornecedorId == null) viatura.Fornecedor = null;
  }
  }
}

