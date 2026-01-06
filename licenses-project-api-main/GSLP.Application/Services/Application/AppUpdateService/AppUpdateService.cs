using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AppUpdateService.DTOs;
using GSLP.Application.Services.Application.AppUpdateService.Filters;
using GSLP.Application.Services.Application.AppUpdateService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Application.Services.Application.AppUpdateService
{
  public class AppUpdateService : BaseService, IAppUpdateService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public AppUpdateService(IRepositoryAsync repository, IMapper mapper)
      : base(repository)
    {
      _repository = repository;
      _mapper = mapper;
    }

    #region [-- APPUPDATE - API METHODS --]

    // get full List
    public async Task<Response<IEnumerable<AppUpdateDTO>>> GetAppUpdatesResponseAsync(
      Guid aplicacaoId,
      string keyword = ""
    )
    {
      try
      {
        var updates = await _repository.GetListAsync<AppUpdate, AppUpdateDTO, Guid>();
        var filtered = updates
          .Where(u => u.AplicacaoId == aplicacaoId.ToString())
          .Where(u =>
            string.IsNullOrEmpty(keyword)
            || u.Versao?.Contains(keyword, StringComparison.OrdinalIgnoreCase) == true
            || u.Descricao?.Contains(keyword, StringComparison.OrdinalIgnoreCase) == true
          )
          .OrderByDescending(u => u.DataLancamento);

        return Response<IEnumerable<AppUpdateDTO>>.Success(filtered);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<AppUpdateDTO>>.Fail(ex.Message);
      }
    }

    // get paginated list (for frontend tables)
    public async Task<PaginatedResponse<AppUpdateDTO>> GetAppUpdatesPaginatedResponseAsync(
      AppUpdateTableFilter filter
    )
    {
      try
      {
        string dynamicOrder =
          (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : "";

        // Get all updates for the application
        var allUpdates = await _repository.GetListAsync<AppUpdate, AppUpdateDTO, Guid>();
        var filteredUpdates = allUpdates
          .Where(u => u.AplicacaoId == filter.AplicacaoId.ToString())
          .AsQueryable();

        // Apply keyword search if provided
        if (!string.IsNullOrEmpty(filter.Keyword))
        {
          string keyword = filter.Keyword;
          filteredUpdates = filteredUpdates.Where(u =>
            (u.Versao != null && u.Versao.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            || (
              u.Descricao != null
              && u.Descricao.Contains(keyword, StringComparison.OrdinalIgnoreCase)
            )
          );
        }

        // Apply sorting
        if (!string.IsNullOrEmpty(dynamicOrder))
        {
          // For now, we'll sort by DataLancamento descending by default
          // In a full implementation, you'd parse dynamicOrder and apply it
          filteredUpdates = filteredUpdates.OrderByDescending(u => u.DataLancamento);
        }
        else
        {
          filteredUpdates = filteredUpdates.OrderByDescending(u => u.DataLancamento);
        }

        // Apply pagination
        var totalCount = filteredUpdates.Count();
        var pagedUpdates = filteredUpdates
          .Skip((filter.PageNumber - 1) * filter.PageSize)
          .Take(filter.PageSize)
          .ToList();

        return new PaginatedResponse<AppUpdateDTO>(
          pagedUpdates,
          totalCount,
          filter.PageNumber,
          filter.PageSize
        );
      }
      catch (Exception ex)
      {
        // Return empty paginated response on error
        return new PaginatedResponse<AppUpdateDTO>(new List<AppUpdateDTO>(), 0, 1, filter.PageSize);
      }
    }

    // get single AppUpdate by Id
    public async Task<Response<AppUpdateDTO>> GetAppUpdateResponseAsync(Guid id)
    {
      try
      {
        AppUpdateDTO dto = await _repository.GetByIdAsync<AppUpdate, AppUpdateDTO, Guid>(id);
        if (dto == null)
        {
          return Response<AppUpdateDTO>.Fail("Update não encontrado");
        }
        return Response<AppUpdateDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<AppUpdateDTO>.Fail(ex.Message);
      }
    }

    // create new AppUpdate
    public async Task<Response<Guid>> CreateAppUpdateResponseAsync(CreateAppUpdateRequest request)
    {
      try
      {
        // Validate Aplicacao exists
        var aplicacao = await _repository.GetByIdAsync<Aplicacao, Guid>(request.AplicacaoId);
        if (aplicacao == null)
        {
          return Response<Guid>.Fail("Aplicação não encontrada");
        }

        // Check if version already exists for this application
        var existingUpdates = await _repository.GetListAsync<AppUpdate, Guid>();
        if (
          existingUpdates.Any(u =>
            u.AplicacaoId == request.AplicacaoId && u.Versao == request.Versao
          )
        )
        {
          return Response<Guid>.Fail("Já existe um update com esta versão para esta aplicação");
        }

        // Validate clienteIds if provided
        if (request.ClienteIds != null && request.ClienteIds.Any())
        {
          // Remove duplicates
          request.ClienteIds = request.ClienteIds.Distinct().ToList();

          // Validate all clienteIds exist
          var allClientes = await _repository.GetListAsync<Cliente, Guid>();
          var invalidClienteIds = request
            .ClienteIds.Where(cid => !allClientes.Any(c => c.Id == cid))
            .ToList();

          if (invalidClienteIds.Any())
          {
            return Response<Guid>.Fail(
              $"Os seguintes IDs de cliente não existem: {string.Join(", ", invalidClienteIds)}"
            );
          }

          // Validate that all clienteIds have an active licenca for this aplicacao
          var clientsWithoutLicenca = new List<Guid>();
          foreach (var clienteId in request.ClienteIds)
          {
            var licencaSpec = new LicencaMatchClienteAndAplicacao(clienteId, request.AplicacaoId);
            var licenca = await _repository.FirstOrDefaultAsync<Licenca, Guid>(licencaSpec);
            if (licenca == null)
            {
              clientsWithoutLicenca.Add(clienteId);
            }
          }

          if (clientsWithoutLicenca.Any())
          {
            return Response<Guid>.Fail(
              "Um ou mais clientes selecionados não possuem uma licença ativa para esta aplicação"
            );
          }
        }

        AppUpdate newAppUpdate = _mapper.Map(request, new AppUpdate());
        newAppUpdate.Id = Guid.NewGuid();
        newAppUpdate.FicheiroUpdate = string.Empty; // Will be set when file is uploaded
        newAppUpdate.TamanhoFicheiro = 0;
        newAppUpdate.HashFicheiro = string.Empty;
        newAppUpdate.FicheiroUpdateApi = string.Empty;
        newAppUpdate.TamanhoFicheiroApi = 0;
        newAppUpdate.HashFicheiroApi = string.Empty;
        newAppUpdate.FicheiroUpdateFrontend = string.Empty;
        newAppUpdate.TamanhoFicheiroFrontend = 0;
        newAppUpdate.HashFicheiroFrontend = string.Empty;

        // Always set obrigatorio to true regardless of request value
        newAppUpdate.Obrigatorio = true;

        AppUpdate response = await _repository.CreateAsync<AppUpdate, Guid>(newAppUpdate);
        _ = await _repository.SaveChangesAsync();

        // Create cliente associations if provided
        if (request.ClienteIds != null && request.ClienteIds.Any())
        {
          // Reload with navigation property
          var spec = new AppUpdateWithClientes(response.Id);
          var appUpdateWithNav = await _repository.GetByIdAsync<AppUpdate, Guid>(response.Id, spec);

          if (appUpdateWithNav != null)
          {
            foreach (var clienteId in request.ClienteIds)
            {
              appUpdateWithNav.AppUpdatesClientes.Add(
                new AppUpdateCliente { AppUpdateId = response.Id, ClienteId = clienteId }
              );
            }
            // Force entity to be marked as modified by touching LastModifiedOn
            // This ensures UpdateAsync detects changes even if only navigation properties changed
            appUpdateWithNav.LastModifiedOn = DateTime.Now;
            await _repository.UpdateAsync<AppUpdate, Guid>(appUpdateWithNav);
            await _repository.SaveChangesAsync();
          }
        }

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update AppUpdate
    public async Task<Response<Guid>> UpdateAppUpdateResponseAsync(
      UpdateAppUpdateRequest request,
      Guid id
    )
    {
      try
      {
        // Load AppUpdate with navigation property
        var spec = new AppUpdateWithClientes(id);
        AppUpdate appUpdateInDb = await _repository.GetByIdAsync<AppUpdate, Guid>(id, spec);
        if (appUpdateInDb == null)
        {
          return Response<Guid>.Fail("Update não encontrado");
        }

        // Check if version already exists for another update of the same application
        var existingUpdates = await _repository.GetListAsync<AppUpdate, Guid>();
        if (
          existingUpdates.Any(u =>
            u.Id != id && u.AplicacaoId == request.AplicacaoId && u.Versao == request.Versao
          )
        )
        {
          return Response<Guid>.Fail("Já existe outro update com esta versão para esta aplicação");
        }

        // Validate clienteIds if provided
        if (request.ClienteIds != null && request.ClienteIds.Any())
        {
          // Remove duplicates
          request.ClienteIds = request.ClienteIds.Distinct().ToList();

          // Validate all clienteIds exist
          var allClientes = await _repository.GetListAsync<Cliente, Guid>();
          var invalidClienteIds = request
            .ClienteIds.Where(cid => !allClientes.Any(c => c.Id == cid))
            .ToList();

          if (invalidClienteIds.Any())
          {
            return Response<Guid>.Fail(
              $"Os seguintes IDs de cliente não existem: {string.Join(", ", invalidClienteIds)}"
            );
          }

          // Validate that all clienteIds have an active licenca for this aplicacao
          var clientsWithoutLicenca = new List<Guid>();
          foreach (var clienteId in request.ClienteIds)
          {
            var licencaSpec = new LicencaMatchClienteAndAplicacao(clienteId, request.AplicacaoId);
            var licenca = await _repository.FirstOrDefaultAsync<Licenca, Guid>(licencaSpec);
            if (licenca == null)
            {
              clientsWithoutLicenca.Add(clienteId);
            }
          }

          if (clientsWithoutLicenca.Any())
          {
            return Response<Guid>.Fail(
              "Um ou mais clientes selecionados não possuem uma licença ativa para esta aplicação"
            );
          }
        }

        // Map request properties to the tracked entity
        _mapper.Map(request, appUpdateInDb);
        // Always set obrigatorio to true regardless of request value
        appUpdateInDb.Obrigatorio = true;

        // Update cliente associations through navigation property
        // Clear existing associations
        appUpdateInDb.AppUpdatesClientes.Clear();

        // Add new associations if provided
        if (request.ClienteIds != null && request.ClienteIds.Any())
        {
          foreach (var clienteId in request.ClienteIds)
          {
            appUpdateInDb.AppUpdatesClientes.Add(
              new AppUpdateCliente { AppUpdateId = id, ClienteId = clienteId }
            );
          }
        }

        // Force entity to be marked as modified by touching LastModifiedOn
        // This ensures UpdateAsync detects changes even if only navigation properties changed
        appUpdateInDb.LastModifiedOn = DateTime.Now;

        // Use the tracked entity directly to ensure navigation property changes are detected
        AppUpdate response = await _repository.UpdateAsync<AppUpdate, Guid>(appUpdateInDb);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete AppUpdate
    public async Task<Response<Guid>> DeleteAppUpdateResponseAsync(Guid id)
    {
      try
      {
        AppUpdate appUpdate = await _repository.GetByIdAsync<AppUpdate, Guid>(id);
        if (appUpdate == null)
        {
          return Response<Guid>.Fail("Update não encontrado");
        }

        string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Updates");

        // Delete the legacy update file if it exists
        if (!string.IsNullOrEmpty(appUpdate.FicheiroUpdate))
        {
          string filePath = Path.Combine(directoryPath, appUpdate.FicheiroUpdate);
          if (System.IO.File.Exists(filePath))
          {
            System.IO.File.Delete(filePath);
          }
        }

        // Delete the API update file if it exists
        if (!string.IsNullOrEmpty(appUpdate.FicheiroUpdateApi))
        {
          string filePath = Path.Combine(directoryPath, appUpdate.FicheiroUpdateApi);
          if (System.IO.File.Exists(filePath))
          {
            System.IO.File.Delete(filePath);
          }
        }

        // Delete the Frontend update file if it exists
        if (!string.IsNullOrEmpty(appUpdate.FicheiroUpdateFrontend))
        {
          string filePath = Path.Combine(directoryPath, appUpdate.FicheiroUpdateFrontend);
          if (System.IO.File.Exists(filePath))
          {
            System.IO.File.Delete(filePath);
          }
        }

        _ = await _repository.RemoveByIdAsync<AppUpdate, Guid>(id);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // check for available updates
    // Returns minimum set of updates needed to bring both API and Frontend to latest version
    public async Task<Response<CheckUpdateResponse>> CheckForUpdateResponseAsync(
      CheckUpdateRequest request
    )
    {
      try
      {
        // First, verify the requesting client has an active licenca for this aplicacao
        if (request.ClienteId.HasValue)
        {
          var licencaSpec = new LicencaMatchClienteAndAplicacao(
            request.ClienteId.Value,
            request.AplicacaoId
          );
          var licenca = await _repository.FirstOrDefaultAsync<Licenca, Guid>(licencaSpec);
          if (licenca == null)
          {
            // Client doesn't have a licenca for this aplicacao, return no updates
            return Response<CheckUpdateResponse>.Success(
              new CheckUpdateResponse
              {
                TemUpdate = false,
                UpdateDisponivel = null,
                UpdatesDisponiveis = new List<AppUpdateDTO>(),
                Obrigatorio = false,
              }
            );
          }
        }

        // Load updates with their cliente associations
        var updates = await _repository.GetListAsync<AppUpdate, Guid>();

        // Get all updates newer than current version
        var candidateUpdateIds = updates
          .Where(u =>
            u.AplicacaoId == request.AplicacaoId
            && u.Ativo
            && CompareVersions(u.Versao, request.VersaoAtual) > 0
          )
          .Select(u => u.Id)
          .ToList();

        // Load updates with their cliente associations
        var candidateUpdates = new List<AppUpdate>();
        var updateClienteAssociations = new List<AppUpdateCliente>();

        foreach (var updateId in candidateUpdateIds)
        {
          var spec = new AppUpdateWithClientes(updateId);
          var update = await _repository.GetByIdAsync<AppUpdate, Guid>(updateId, spec);
          if (update != null)
          {
            candidateUpdates.Add(update);
            if (update.AppUpdatesClientes != null && update.AppUpdatesClientes.Any())
            {
              updateClienteAssociations.AddRange(update.AppUpdatesClientes);
            }
          }
        }

        // Filter by ClienteId if provided
        List<AppUpdate> availableUpdates;
        if (request.ClienteId.HasValue)
        {
          // Filter updates: include if:
          // 1. Update has no cliente associations (available to all), OR
          // 2. Update has the requesting ClienteId in its associations
          availableUpdates = candidateUpdates
            .Where(u =>
            {
              var hasAssociations = updateClienteAssociations.Any(auc => auc.AppUpdateId == u.Id);
              if (!hasAssociations)
              {
                // No associations = available to all clients
                return true;
              }
              // Has associations = only available to specific clients
              return updateClienteAssociations.Any(auc =>
                auc.AppUpdateId == u.Id && auc.ClienteId == request.ClienteId.Value
              );
            })
            .ToList();
        }
        else
        {
          // No ClienteId provided - return all updates (backward compatibility)
          // Note: In production, this should ideally require ClienteId, but we maintain backward compatibility
          availableUpdates = candidateUpdates;
        }

        // Sort by version descending using proper comparison
        availableUpdates.Sort((a, b) => CompareVersions(b.Versao, a.Versao));

        if (availableUpdates.Any())
        {
          // Separate targeted updates from global updates
          var targetedUpdates = new List<AppUpdate>();
          var globalUpdates = new List<AppUpdate>();

          foreach (var update in availableUpdates)
          {
            var hasAssociations = updateClienteAssociations.Any(auc =>
              auc.AppUpdateId == update.Id
            );
            if (hasAssociations && request.ClienteId.HasValue)
            {
              // Check if this update is targeted to the requesting client
              var isTargetedToClient = updateClienteAssociations.Any(auc =>
                auc.AppUpdateId == update.Id && auc.ClienteId == request.ClienteId.Value
              );
              if (isTargetedToClient)
              {
                targetedUpdates.Add(update);
              }
            }
            else
            {
              // Global update (no clienteIds)
              globalUpdates.Add(update);
            }
          }

          // Find latest global update that includes API (TipoUpdate = 1 or 3)
          var latestGlobalApiUpdate = globalUpdates.FirstOrDefault(u =>
            u.TipoUpdate == Domain.Enums.UpdateType.API
            || u.TipoUpdate == Domain.Enums.UpdateType.Both
          );

          // Find latest global update that includes Frontend (TipoUpdate = 2 or 3)
          var latestGlobalFrontendUpdate = globalUpdates.FirstOrDefault(u =>
            u.TipoUpdate == Domain.Enums.UpdateType.Frontend
            || u.TipoUpdate == Domain.Enums.UpdateType.Both
          );

          // Find all targeted updates that include API
          var targetedApiUpdates = targetedUpdates
            .Where(u =>
              u.TipoUpdate == Domain.Enums.UpdateType.API
              || u.TipoUpdate == Domain.Enums.UpdateType.Both
            )
            .ToList();

          // Find all targeted updates that include Frontend
          var targetedFrontendUpdates = targetedUpdates
            .Where(u =>
              u.TipoUpdate == Domain.Enums.UpdateType.Frontend
              || u.TipoUpdate == Domain.Enums.UpdateType.Both
            )
            .ToList();

          // Build unique set of required updates
          // Include ALL targeted updates + latest global updates
          var requiredUpdates = new List<AppUpdate>();

          // Add all targeted API updates
          requiredUpdates.AddRange(targetedApiUpdates);

          // Add latest global API update if not already included
          if (
            latestGlobalApiUpdate != null
            && !requiredUpdates.Any(u => u.Id == latestGlobalApiUpdate.Id)
          )
          {
            requiredUpdates.Add(latestGlobalApiUpdate);
          }

          // Add all targeted Frontend updates
          requiredUpdates.AddRange(targetedFrontendUpdates);

          // Add latest global Frontend update if not already included
          if (
            latestGlobalFrontendUpdate != null
            && !requiredUpdates.Any(u => u.Id == latestGlobalFrontendUpdate.Id)
          )
          {
            requiredUpdates.Add(latestGlobalFrontendUpdate);
          }

          // Order by version ascending (apply oldest first)
          requiredUpdates.Sort((a, b) => CompareVersions(a.Versao, b.Versao));

          // Map to DTOs (only include active updates)
          var requiredUpdateDtos = new List<AppUpdateDTO>();
          foreach (var update in requiredUpdates)
          {
            var dto = await _repository.GetByIdAsync<AppUpdate, AppUpdateDTO, Guid>(update.Id);
            if (dto != null && dto.Ativo)
              requiredUpdateDtos.Add(dto);
          }

          // Check if any update is mandatory
          // All updates returned are mandatory:
          // 1. Updates targeted to specific clients (always mandatory for those clients)
          // 2. Latest global updates (always mandatory - client must apply them)
          // Since we only return targeted updates + latest global updates, all are mandatory
          var anyMandatory = requiredUpdates.Any(); // All returned updates are mandatory

          return Response<CheckUpdateResponse>.Success(
            new CheckUpdateResponse
            {
              TemUpdate = true,
              UpdateDisponivel = requiredUpdateDtos.LastOrDefault(), // Latest for backward compatibility
              UpdatesDisponiveis = requiredUpdateDtos,
              Obrigatorio = anyMandatory,
            }
          );
        }

        return Response<CheckUpdateResponse>.Success(
          new CheckUpdateResponse
          {
            TemUpdate = false,
            UpdateDisponivel = null,
            UpdatesDisponiveis = new List<AppUpdateDTO>(),
            Obrigatorio = false,
          }
        );
      }
      catch (Exception ex)
      {
        return Response<CheckUpdateResponse>.Fail(ex.Message);
      }
    }

    // get latest update for an application
    public async Task<Response<AppUpdateDTO>> GetLatestUpdateResponseAsync(Guid aplicacaoId)
    {
      try
      {
        var updates = await _repository.GetListAsync<AppUpdate, AppUpdateDTO, Guid>();
        var latestUpdate = updates
          .Where(u => u.AplicacaoId == aplicacaoId.ToString() && u.Ativo)
          .OrderByDescending(u => u.DataLancamento)
          .FirstOrDefault();

        if (latestUpdate == null)
        {
          return Response<AppUpdateDTO>.Fail("Nenhum update disponível");
        }

        return Response<AppUpdateDTO>.Success(latestUpdate);
      }
      catch (Exception ex)
      {
        return Response<AppUpdateDTO>.Fail(ex.Message);
      }
    }

    // update file info for an update
    // packageType: null = legacy single file, 1 = API, 2 = Frontend
    public async Task<Response<Guid>> UpdateAppUpdateFileInfoResponseAsync(
      Guid id,
      string fileName,
      long fileSize,
      string fileHash,
      int? packageType = null
    )
    {
      try
      {
        AppUpdate appUpdate = await _repository.GetByIdAsync<AppUpdate, Guid>(id);
        if (appUpdate == null)
        {
          return Response<Guid>.Fail("Update não encontrado");
        }

        // If packageType is specified and TipoUpdate is Both, store in separate fields
        if (packageType.HasValue && appUpdate.TipoUpdate == Domain.Enums.UpdateType.Both)
        {
          if (packageType.Value == (int)Domain.Enums.UpdateType.API)
          {
            appUpdate.FicheiroUpdateApi = fileName;
            appUpdate.TamanhoFicheiroApi = fileSize;
            appUpdate.HashFicheiroApi = fileHash;
          }
          else if (packageType.Value == (int)Domain.Enums.UpdateType.Frontend)
          {
            appUpdate.FicheiroUpdateFrontend = fileName;
            appUpdate.TamanhoFicheiroFrontend = fileSize;
            appUpdate.HashFicheiroFrontend = fileHash;
          }
        }
        else
        {
          // Legacy behavior: single file
          appUpdate.FicheiroUpdate = fileName;
          appUpdate.TamanhoFicheiro = fileSize;
          appUpdate.HashFicheiro = fileHash;
        }

        AppUpdate response = await _repository.UpdateAsync<AppUpdate, Guid>(appUpdate);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete package file for an update
    // packageType: null = legacy single file, 1 = API, 2 = Frontend
    public async Task<Response<Guid>> DeleteAppUpdatePackageResponseAsync(
      Guid id,
      int? packageType = null
    )
    {
      try
      {
        AppUpdate appUpdate = await _repository.GetByIdAsync<AppUpdate, Guid>(id);
        if (appUpdate == null)
        {
          return Response<Guid>.Fail("Update não encontrado");
        }

        // Validate packageType if provided
        if (packageType.HasValue && packageType.Value != 1 && packageType.Value != 2)
        {
          return Response<Guid>.Fail("packageType inválido. Use 1 para API ou 2 para Frontend");
        }

        // Validate packageType is required when TipoUpdate is Both
        if (appUpdate.TipoUpdate == Domain.Enums.UpdateType.Both && !packageType.HasValue)
        {
          return Response<Guid>.Fail(
            "packageType é obrigatório quando TipoUpdate é Both. Use 1 para API ou 2 para Frontend"
          );
        }

        // Validate that the update has the specified package type
        if (packageType.HasValue && appUpdate.TipoUpdate != Domain.Enums.UpdateType.Both)
        {
          return Response<Guid>.Fail("packageType só pode ser usado quando TipoUpdate é Both");
        }

        string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Updates");
        string? fileName = null;

        // Determine which file to delete based on packageType and TipoUpdate
        if (packageType.HasValue && appUpdate.TipoUpdate == Domain.Enums.UpdateType.Both)
        {
          if (packageType.Value == (int)Domain.Enums.UpdateType.API)
          {
            fileName = appUpdate.FicheiroUpdateApi;
            if (string.IsNullOrEmpty(fileName))
            {
              return Response<Guid>.Fail("Ficheiro API não encontrado para este update");
            }
            string filePath = Path.Combine(directoryPath, fileName);
            if (System.IO.File.Exists(filePath))
            {
              System.IO.File.Delete(filePath);
            }
            // Update database fields
            appUpdate.FicheiroUpdateApi = null;
            appUpdate.TamanhoFicheiroApi = 0;
            appUpdate.HashFicheiroApi = null;
          }
          else if (packageType.Value == (int)Domain.Enums.UpdateType.Frontend)
          {
            fileName = appUpdate.FicheiroUpdateFrontend;
            if (string.IsNullOrEmpty(fileName))
            {
              return Response<Guid>.Fail("Ficheiro Frontend não encontrado para este update");
            }
            string filePath = Path.Combine(directoryPath, fileName);
            if (System.IO.File.Exists(filePath))
            {
              System.IO.File.Delete(filePath);
            }
            // Update database fields
            appUpdate.FicheiroUpdateFrontend = null;
            appUpdate.TamanhoFicheiroFrontend = 0;
            appUpdate.HashFicheiroFrontend = null;
          }
        }
        else
        {
          // Legacy behavior: single file
          fileName = appUpdate.FicheiroUpdate;
          if (string.IsNullOrEmpty(fileName))
          {
            return Response<Guid>.Fail("Ficheiro não encontrado para este update");
          }
          string filePath = Path.Combine(directoryPath, fileName);
          if (System.IO.File.Exists(filePath))
          {
            System.IO.File.Delete(filePath);
          }
          // Update database fields
          appUpdate.FicheiroUpdate = null;
          appUpdate.TamanhoFicheiro = 0;
          appUpdate.HashFicheiro = null;
        }

        // Update the entity even if file wasn't found (clean up database)
        AppUpdate response = await _repository.UpdateAsync<AppUpdate, Guid>(appUpdate);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // get update statistics for an application
    public async Task<Response<AppUpdateStatisticsDTO>> GetAppUpdateStatisticsResponseAsync(
      Guid aplicacaoId
    )
    {
      try
      {
        var updates = await _repository.GetListAsync<AppUpdate, AppUpdateDTO, Guid>();
        var appUpdates = updates.Where(u => u.AplicacaoId == aplicacaoId.ToString()).ToList();

        var statistics = new AppUpdateStatisticsDTO
        {
          TotalUpdates = appUpdates.Count,
          ActiveUpdates = appUpdates.Count(u => u.Ativo),
          MandatoryUpdates = appUpdates.Count(u => u.Obrigatorio && u.Ativo),
          LatestVersion = appUpdates
            .Where(u => u.Ativo)
            .OrderByDescending(u => u.DataLancamento)
            .FirstOrDefault()
            ?.Versao,
          LatestReleaseDate = appUpdates
            .Where(u => u.Ativo)
            .OrderByDescending(u => u.DataLancamento)
            .FirstOrDefault()
            ?.DataLancamento,
          TotalFileSize = appUpdates.Sum(u => u.TamanhoFicheiro),
        };

        return Response<AppUpdateStatisticsDTO>.Success(statistics);
      }
      catch (Exception ex)
      {
        return Response<AppUpdateStatisticsDTO>.Fail(ex.Message);
      }
    }

    #endregion [-- APPUPDATE - API METHODS --]

    #region [-- HELPER METHODS --]

    // Compare version strings (e.g., "1.2.3" vs "1.2.4")
    // Returns: > 0 if version1 > version2, < 0 if version1 < version2, 0 if equal
    private int CompareVersions(string version1, string version2)
    {
      if (string.IsNullOrEmpty(version1))
        return -1;
      if (string.IsNullOrEmpty(version2))
        return 1;

      string[] v1Parts = version1.Split('.');
      string[] v2Parts = version2.Split('.');

      int maxLength = Math.Max(v1Parts.Length, v2Parts.Length);

      for (int i = 0; i < maxLength; i++)
      {
        int v1Part = i < v1Parts.Length && int.TryParse(v1Parts[i], out int v1) ? v1 : 0;
        int v2Part = i < v2Parts.Length && int.TryParse(v2Parts[i], out int v2) ? v2 : 0;

        if (v1Part != v2Part)
        {
          return v1Part.CompareTo(v2Part);
        }
      }

      return 0;
    }

    // Calculate SHA256 hash of a file
    public static string CalculateFileHash(string filePath)
    {
      using (SHA256 sha256 = SHA256.Create())
      {
        using (FileStream stream = File.OpenRead(filePath))
        {
          byte[] hashBytes = sha256.ComputeHash(stream);
          return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }
      }
    }

    #endregion [-- HELPER METHODS --]
  }
}
