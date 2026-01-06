using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Constants;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Application.Services.Platform.LicencaService.Filters;
using GSLP.Application.Services.Platform.LicencaService.Helpers;
using GSLP.Application.Services.Platform.LicencaService.Specifications;
using GSLP.Application.Services.Platform.LicencaUtilizadorService;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.Specifications;
using GSLP.Application.Services.Platform.PerfilUtilizadorService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

// After creating this service:
// -- 1. Create a Licenca domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Licenca> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Licencas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Platform.LicencaService
{
  public class LicencaService : BaseService, ILicencaService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;
    private readonly IHelperService _helperService;
    private readonly ICurrentTenantUserService _currentTenantUserService;
    private readonly ILicencaUtilizadorRepository _licencaUtilizadorRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public LicencaService(
      IRepositoryAsync repository,
      IMapper mapper,
      IHelperService helperService,
      ICurrentTenantUserService currentTenantUserService,
      ILicencaUtilizadorRepository licencaUtilizadorRepository,
      UserManager<ApplicationUser> userManager,
      IConfiguration configuration
    )
      : base(repository)
    {
      _repository = repository;
      _mapper = mapper;
      _helperService = helperService;
      _currentTenantUserService = currentTenantUserService;
      _licencaUtilizadorRepository = licencaUtilizadorRepository;
      _userManager = userManager;
      _configuration = configuration;
    }

    #region [-- LICENCA - API METHODS --]

    // get full List
    public async Task<Response<IEnumerable<LicencaDTO>>> GetLicencasResponseAsync(
      string keyword = ""
    )
    {
      LicencaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<LicencaDTO> list = await _repository.GetListAsync<Licenca, LicencaDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<LicencaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<LicencaDTO>> GetLicencasPaginatedResponseAsync(
      LicencaTableFilter filter
    )
    {
      string dynamicOrder =
        (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable

      LicencaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification

      PaginatedResponse<LicencaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Licenca,
        LicencaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Licenca by Id
    public async Task<Response<LicencaDTO>> GetLicencaResponseAsync(Guid id)
    {
      try
      {
        LicencaDTO dto = await _repository.GetByIdAsync<Licenca, LicencaDTO, Guid>(id);
        if (dto == null)
        {
          return Response<LicencaDTO>.Fail("Licença não encontrada");
        }
        return Response<LicencaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<LicencaDTO>.Fail(ex.Message);
      }
    }

    // create new Licenca
    public async Task<Response<Guid>> CreateLicencaResponseAsync(CreateLicencaRequest request)
    {
      LicencaMatchName licencaMatchName = new(request.Nome); // ardalis specification
      bool LicencaExists = await _repository.ExistsAsync<Licenca, Guid>(licencaMatchName);
      if (LicencaExists)
      {
        return Response<Guid>.Fail("Já existe uma licença com o nome fornecido");
      }

      Licenca newLicenca = _mapper.Map(request, new Licenca()); // map dto to domain entity

      try
      {
        Licenca response = await _repository.CreateAsync<Licenca, Guid>(newLicenca); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Licenca
    public async Task<Response<Guid>> UpdateLicencaResponseAsync(
      UpdateLicencaRequest request,
      Guid id
    )
    {
      Licenca LicencaInDb = await _repository.GetByIdAsync<Licenca, Guid>(id); // get existing entity
      if (LicencaInDb == null)
      {
        return Response<Guid>.Fail("Não encontrada");
      }

      Licenca updatedLicenca = _mapper.Map(request, LicencaInDb); // map dto to domain entity

      try
      {
        Licenca response = await _repository.UpdateAsync<Licenca, Guid>(updatedLicenca); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // toggle block/unblock Licenca status
    public async Task<Response<Guid>> ToggleLicencaBlockStatusResponseAsync(
      Guid id,
      bool block,
      string? motivoBloqueio = null
    )
    {
      try
      {
        // Retrieve the API key from the helper service
        string? APIKey = await _helperService.GetAPIKeyFromHttpContextAsync();
        if (string.IsNullOrEmpty(APIKey))
        {
          return Response<Guid>.Fail("API Key em falta.");
        }

        // Retrieve the Licenca by ID
        Licenca licenca = await GetLicencaByIdAsync(id);

        if (licenca == null)
        {
          return Response<Guid>.Fail("Licença não encontrada.");
        }

        // Retrieve the Licenca from the API Key
        Guid? licencaIdOrNullFromAPIKey = await _helperService.GetLicencaIdFromHttpContextAsync();
        Guid licencaIdFromAPIKey = licencaIdOrNullFromAPIKey.Value;

        // Prevent blocking of the Licenca if it is the one currently in use (LicencaAPIKey)
        if (licenca.Id == licencaIdFromAPIKey)
        {
          return Response<Guid>.Fail(
            "Não é possível bloquear a Licença que está a ser utilizada no momento."
          );
        }

        // Update the block status
        licenca.Bloqueada = block;

        // If blocking, set the motivoBloqueio; if unblocking, clear it
        if (block)
        {
          licenca.MotivoBloqueio = motivoBloqueio ?? "Sem motivo especificado"; // Optional: set default message if no reason is provided
          licenca.DataBloqueio = DateTime.Now; // Set the block date to current time
          licenca.Ativo = false;

          // Only update LicencaAPIKey if it exists
          if (licenca.LicencaAPIKey != null && !licenca.LicencaAPIKeyId.Equals(Guid.Empty))
          {
            licenca.LicencaAPIKey.Ativo = false; // Disable the LicencaAPIKey when blocking
          }
        }
        else
        {
          licenca.MotivoBloqueio = string.Empty; // Clear the reason when unblocking
          licenca.DataBloqueio = null; // Remove the block date
          licenca.Ativo = true;

          // Only update LicencaAPIKey if it exists
          if (licenca.LicencaAPIKey != null && !licenca.LicencaAPIKeyId.Equals(Guid.Empty))
          {
            licenca.LicencaAPIKey.Ativo = true; // Enable the LicencaAPIKey when unblocking
          }
        }

        // Update the Licenca in the database
        Licenca updatedLicenca = await _repository.UpdateAsync<Licenca, Guid>(licenca);
        _ = await _repository.SaveChangesAsync(); // Save changes to DB

        return Response<Guid>.Success(updatedLicenca.Id); // Return the Id of the updated Licenca
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Licenca
    public async Task<Response<Guid>> DeleteLicencaResponseAsync(Guid id)
    {
      try
      {
        Guid? licencaIdOrNullFromAPIKey = await _helperService.GetLicencaIdFromHttpContextAsync();
        Guid licencaIdFromAPIKey = licencaIdOrNullFromAPIKey.Value;

        if (licencaIdFromAPIKey == id)
        {
          return Response<Guid>.Fail("Não é possível apagar a licença em uso");
        }

        LicencaAddAllIncludes specification = new();
        Licenca licenca = await _repository.GetByIdAsync(id, specification);

        if (licenca == null)
        {
          return Response<Guid>.Fail("Licença não encontrada");
        }

        if (licenca.Ativo)
        {
          return Response<Guid>.Fail("A Licença encontra-se ativa");
        }

        if (licenca.LicencasModulos.Count > 0)
        {
          return Response<Guid>.Fail("Licença possui módulos associados");
        }

        if (licenca.LicencasFuncionalidades.Count > 0)
        {
          return Response<Guid>.Fail("Licença possui funcionalidades associadas");
        }

        if (licenca.LicencasUtilizadores.Count > 0)
        {
          return Response<Guid>.Fail("Licença possui utilizadores associados");
        }

        if (licenca.Perfis.Count > 0)
        {
          return Response<Guid>.Fail("Licença possui perfis associados");
        }

        // First delete associated records
        await RemoveLicencaRelationsAsync(licenca);

        Licenca? removedLicenca = await _repository.RemoveByIdAsync<Licenca, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(removedLicenca.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<List<Guid>>> DeleteLicencasAsync(List<Guid> ids)
    {
      List<Guid> successfullyDeleted = [];
      List<string> failureMessages = [];

      try
      {
        foreach (Guid id in ids)
        {
          try
          {
            LicencaAddAllIncludes specification = new();
            Licenca licenca = await _repository.GetByIdAsync(id, specification);

            if (licenca == null)
            {
              failureMessages.Add($"Licença {id} não encontrada");
              continue;
            }

            // Check all relations
            if (licenca.LicencasModulos.Count > 0)
            {
              failureMessages.Add($"Licença {id} possui módulos associados");
              continue;
            }

            if (licenca.LicencasFuncionalidades.Count > 0)
            {
              failureMessages.Add($"Licença {id} possui funcionalidades associadas");
              continue;
            }

            if (licenca.LicencasUtilizadores.Count > 0)
            {
              failureMessages.Add($"Licença {id} possui utilizadores associados");
              continue;
            }

            if (licenca.Perfis.Count > 0)
            {
              failureMessages.Add($"Licença {id} possui perfis associados");
              continue;
            }

            // First delete associated records
            await RemoveLicencaRelationsAsync(licenca);

            // Then delete the licenca
            Licenca? removedLicenca = await _repository.RemoveByIdAsync<Licenca, Guid>(id);
            if (removedLicenca != null)
            {
              successfullyDeleted.Add(removedLicenca.Id);
            }
          }
          catch (Exception ex)
          {
            failureMessages.Add($"Erro ao processar licença {id}: {ex.Message}");
          }
        }

        _ = await _repository.SaveChangesAsync();

        return failureMessages.Count > 0
          ? Response<List<Guid>>.Fail(failureMessages)
          : Response<List<Guid>>.Success(successfullyDeleted);
      }
      catch (Exception ex)
      {
        return Response<List<Guid>>.Fail(ex.Message);
      }
    }

    // remove Licenca relations
    private async Task RemoveLicencaRelationsAsync(Licenca licenca)
    {
      await _repository.DeleteWhereAsync<LicencaFuncionalidade>(lf => lf.LicencaId == licenca.Id);
      await _repository.DeleteWhereAsync<LicencaModulo>(lm => lm.LicencaId == licenca.Id);
      await _repository.DeleteWhereAsync<LicencaUtilizador>(lu => lu.LicencaId == licenca.Id);

      PerfilFuncionalidadeAddAllIncludes perfilFuncionalidadeAddAllIncludes = new();
      await _repository.DeleteWhereAsync(
        pf => pf.Perfil.LicencaId == licenca.Id,
        perfilFuncionalidadeAddAllIncludes
      );

      PerfilUtilizadorAddAllIncludes perfilUtilizadorAddAllIncludes = new();
      await _repository.DeleteWhereAsync(
        pu => pu.Perfil.LicencaId == licenca.Id,
        perfilUtilizadorAddAllIncludes
      );
      await _repository.DeleteWhereAsync<Perfil>(lp => lp.LicencaId == licenca.Id);
      await _repository.DeleteWhereAsync<LicencaAPIKey>(lak => lak.LicencaId == licenca.Id);
    }

    // get licenca by APIKey
    public async Task<Response<LicencaDTO>> GetLicencaByAPIKeyResponseAsync()
    {
      try
      {
        // Get the current user's ID and roles
        string userId = _currentTenantUserService.UserId;
        IList<string> userRoles = await _userManager.GetRolesAsync(
          await _userManager.FindByIdAsync(userId)
        );
        bool isAdminRole = userRoles.Any(r => r is "admin");

        if (isAdminRole)
        {
          // For admin users, get license from their association
          var userLicense = await _licencaUtilizadorRepository.GetUserLicencaIdAsync(userId);
          if (!userLicense.HasValue)
          {
            return Response<LicencaDTO>.Fail("Admin não tem licença associada");
          }

          // Get the license details directly by ID
          var licenca = await _repository.GetByIdAsync<Licenca, LicencaDTO, Guid>(
            userLicense.Value
          );
          if (licenca == null)
          {
            return Response<LicencaDTO>.Fail("Licença não encontrada");
          }

          return Response<LicencaDTO>.Success(licenca);
        }
        else
        {
          // For non-admin users, use the existing API key logic
          string? APIKey = await _helperService.GetAPIKeyFromHttpContextAsync();
          if (string.IsNullOrEmpty(APIKey))
          {
            return Response<LicencaDTO>.Fail("API Key em falta.");
          }

          LicencaMatchAPIKey licencaMatchAPIKey = new(APIKey);
          LicencaDTO licenca = await _repository.FirstOrDefaultAsync<Licenca, LicencaDTO, Guid>(
            licencaMatchAPIKey
          );

          if (licenca == null)
          {
            return Response<LicencaDTO>.Fail(
              "Licença não encontrada para a chave de API fornecida."
            );
          }

          return Response<LicencaDTO>.Success(licenca);
        }
      }
      catch (Exception ex)
      {
        return Response<LicencaDTO>.Fail(ex.Message);
      }
    }

    // get licenca modulos e funcionalidades by Id
    public async Task<
      Response<LicencaModulosFuncionalidadesDTO>
    > GetLicencaModulosFuncionalidadesByIdResponseAsync(Guid id)
    {
      try
      {
        // Create the specification that retrieves Licenca based on the Id
        LicencaMatchId licencaMatchId = new(id);

        // Retrieve the Licenca using the specification
        LicencaModulosFuncionalidadesDTO licenca = await _repository.FirstOrDefaultAsync<
          Licenca,
          LicencaModulosFuncionalidadesDTO,
          Guid
        >(licencaMatchId);

        if (licenca == null)
        {
          // If no Licenca is found for the provided APIKey, return an error response
          return Response<LicencaModulosFuncionalidadesDTO>.Fail(
            "Licença não encontrada para o Id fornecido."
          );
        }

        // Return the Licenca if found
        return Response<LicencaModulosFuncionalidadesDTO>.Success(licenca);
      }
      catch (Exception ex)
      {
        // If any error occurs, return a failure response with the exception message
        return Response<LicencaModulosFuncionalidadesDTO>.Fail(ex.Message);
      }
    }

    public async Task<Response<IEnumerable<LicencaDTO>>> GetLicencasByClienteIdResponseAsync(
      Guid clienteId
    )
    {
      try
      {
        // Create the specification that retrieves Licencas based on the ClienteId
        LicencaMatchClienteId licencaMatchClienteId = new(clienteId);

        // Retrieve the Licencas using the specification
        IEnumerable<LicencaDTO> licencas = await _repository.GetListAsync<
          Licenca,
          LicencaDTO,
          Guid
        >(licencaMatchClienteId);

        if (licencas == null || !licencas.Any())
        {
          return Response<IEnumerable<LicencaDTO>>.Fail(
            "Nenhuma licença encontrada para o cliente fornecido."
          );
        }

        return Response<IEnumerable<LicencaDTO>>.Success(licencas);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<LicencaDTO>>.Fail(ex.Message);
      }
    }

    // get all licenses from the client that owns the given license
    public async Task<Response<IEnumerable<LicencaDTO>>> GetLicencasByLicencaIdResponseAsync(
      Guid licencaId
    )
    {
      try
      {
        // First, get the license to obtain the clienteId
        LicencaDTO licenca = await _repository.GetByIdAsync<Licenca, LicencaDTO, Guid>(licencaId);

        if (licenca == null)
        {
          return Response<IEnumerable<LicencaDTO>>.Fail("Licença não encontrada");
        }

        if (string.IsNullOrEmpty(licenca.ClienteId))
        {
          return Response<IEnumerable<LicencaDTO>>.Fail("A licença não possui cliente associado");
        }

        // Get all licenses for the client
        Guid clienteId = Guid.Parse(licenca.ClienteId);
        return await GetLicencasByClienteIdResponseAsync(clienteId);
      }
      catch (Exception ex)
      {
        return Response<IEnumerable<LicencaDTO>>.Fail(ex.Message);
      }
    }

    // update license version after update completion
    public async Task<Response<Guid>> UpdateLicencaVersaoResponseAsync(Guid id, string versao)
    {
      try
      {
        // Retrieve the license
        Licenca licenca = await GetLicencaByIdAsync(id);
        if (licenca == null)
        {
          return Response<Guid>.Fail("Licença não encontrada");
        }

        // Update the installed version
        licenca.VersaoInstalada = versao;

        // Save changes
        Licenca updatedLicenca = await _repository.UpdateAsync<Licenca, Guid>(licenca);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(updatedLicenca.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // get updater configuration for licenses
    public async Task<Response<UpdaterConfigurationDTO>> GetUpdaterConfigurationResponseAsync(
      List<Guid> licencaIds
    )
    {
      try
      {
        if (licencaIds == null || licencaIds.Count == 0)
        {
          return Response<UpdaterConfigurationDTO>.Fail("Nenhuma licença fornecida");
        }

        // Gestão Interna area ID - licenses from this area should be excluded
        Guid gestaoInternaAreaId = Guid.Parse(AreaIds.GESTAO_INTERNA);
        Guid updaterAppId = Guid.Parse(ApplicationIds.UPDATER);
        Guid gslpManagerAppId = Guid.Parse(ApplicationIds.GSLP_MANAGER);
        Guid companyUpdaterLicenseId = Guid.Parse(
          CompanyUpdaterLicenseId.COMPANY_UPDATER_LICENSE_ID
        );
        Guid companyGslpManagerLicenseId = Guid.Parse(
          CompanyGslpManagerLicenseId.COMPANY_GSLP_MANAGER_LICENSE_ID
        );

        // Step 1: Get the requested license(s)
        LicencaMatchIds specification = new(licencaIds);
        IEnumerable<Licenca> requestedLicencas = await _repository.GetListAsync<Licenca, Guid>(
          specification
        );

        if (requestedLicencas == null || !requestedLicencas.Any())
        {
          return Response<UpdaterConfigurationDTO>.Fail(
            "Licença(s) solicitada(s) não encontrada(s)"
          );
        }

        // Step 2: Determine if we're printing an updater license or a regular license
        Licenca requestedLicenca = requestedLicencas.First();
        bool isUpdaterLicense = requestedLicenca.AplicacaoId == updaterAppId;
        bool isCompanyUpdater = requestedLicenca.Id == companyUpdaterLicenseId;

        string licensesApiBaseUrl;
        string licensesApiKey;
        List<Licenca> clientsList;

        if (isUpdaterLicense)
        {
          // Scenario: Printing an updater license
          if (isCompanyUpdater)
          {
            // Company updater: use company updater data, clients = all licenses with UseOwnUpdater = false
            Licenca companyUpdaterLicenca = requestedLicenca;

            // Always use company GSLP Manager for BaseUrl
            LicencaMatchIds companyGslpManagerSpec = new(
              new List<Guid> { companyGslpManagerLicenseId }
            );
            IEnumerable<Licenca> companyGslpManagerList = await _repository.GetListAsync<
              Licenca,
              Guid
            >(companyGslpManagerSpec);
            Licenca? companyGslpManager = companyGslpManagerList.FirstOrDefault();

            if (companyGslpManager == null || string.IsNullOrEmpty(companyGslpManager.Url2))
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company GSLP Manager license not found or missing BaseUrl (Url2)"
              );
            }
            licensesApiBaseUrl = companyGslpManager.Url2;

            if (
              companyUpdaterLicenca.LicencaAPIKey == null
              || string.IsNullOrEmpty(companyUpdaterLicenca.LicencaAPIKey.APIKey)
            )
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company updater license API key not found or is empty"
              );
            }
            licensesApiKey = companyUpdaterLicenca.LicencaAPIKey.APIKey;

            // Get all licenses with UseOwnUpdater = false (excluding Gestão Interna)
            LicencaSearchList allLicensesSpec = new("");
            IEnumerable<Licenca> allLicenses = await _repository.GetListAsync<Licenca, Guid>(
              allLicensesSpec
            );
            clientsList = allLicenses
              .Where(l =>
                l.Aplicacao != null
                && l.Aplicacao.AreaId != gestaoInternaAreaId
                && l.Cliente != null
                && (l.UseOwnUpdater == null || l.UseOwnUpdater == false)
              )
              .ToList();
          }
          else
          {
            // Client updater: use client updater data, clients = only this client's licenses with UseOwnUpdater = true
            Licenca clientUpdaterLicenca = requestedLicenca;
            Guid clienteId = clientUpdaterLicenca.ClienteId;

            // Always use company GSLP Manager for BaseUrl
            LicencaMatchIds companyGslpManagerSpec = new(
              new List<Guid> { companyGslpManagerLicenseId }
            );
            IEnumerable<Licenca> companyGslpManagerList = await _repository.GetListAsync<
              Licenca,
              Guid
            >(companyGslpManagerSpec);
            Licenca? companyGslpManager = companyGslpManagerList.FirstOrDefault();

            if (companyGslpManager == null || string.IsNullOrEmpty(companyGslpManager.Url2))
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company GSLP Manager license not found or missing BaseUrl (Url2)"
              );
            }
            licensesApiBaseUrl = companyGslpManager.Url2;

            // Get client licenses for the clients list
            LicencaMatchClienteId clientClienteSpec = new(clienteId);
            IEnumerable<Licenca> clientLicencas = await _repository.GetListAsync<Licenca, Guid>(
              clientClienteSpec
            );

            if (
              clientUpdaterLicenca.LicencaAPIKey == null
              || string.IsNullOrEmpty(clientUpdaterLicenca.LicencaAPIKey.APIKey)
            )
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Client updater license API key not found or is empty"
              );
            }
            licensesApiKey = clientUpdaterLicenca.LicencaAPIKey.APIKey;

            // Get only this client's licenses with UseOwnUpdater = true (excluding Gestão Interna)
            clientsList = clientLicencas
              .Where(l =>
                l.Aplicacao != null
                && l.Aplicacao.AreaId != gestaoInternaAreaId
                && l.UseOwnUpdater == true
              )
              .ToList();
          }
        }
        else
        {
          // Scenario: Printing a non-updater license
          bool useOwnUpdater = requestedLicenca.UseOwnUpdater == true;

          if (useOwnUpdater)
          {
            // Use client's own updater data
            Guid clienteId = requestedLicenca.ClienteId;

            // Find client's updater license
            LicencaMatchClienteId clientClienteSpec = new(clienteId);
            IEnumerable<Licenca> clientLicencas = await _repository.GetListAsync<Licenca, Guid>(
              clientClienteSpec
            );
            Licenca? clientUpdater = clientLicencas.FirstOrDefault(l =>
              l.AplicacaoId == updaterAppId
            );

            if (clientUpdater == null)
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Client updater license not found for this license"
              );
            }

            // Always use company GSLP Manager for BaseUrl
            LicencaMatchIds companyGslpManagerSpec = new(
              new List<Guid> { companyGslpManagerLicenseId }
            );
            IEnumerable<Licenca> companyGslpManagerList = await _repository.GetListAsync<
              Licenca,
              Guid
            >(companyGslpManagerSpec);
            Licenca? companyGslpManager = companyGslpManagerList.FirstOrDefault();

            if (companyGslpManager == null || string.IsNullOrEmpty(companyGslpManager.Url2))
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company GSLP Manager license not found or missing BaseUrl (Url2)"
              );
            }
            licensesApiBaseUrl = companyGslpManager.Url2;

            if (
              clientUpdater.LicencaAPIKey == null
              || string.IsNullOrEmpty(clientUpdater.LicencaAPIKey.APIKey)
            )
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Client updater license API key not found or is empty"
              );
            }
            licensesApiKey = clientUpdater.LicencaAPIKey.APIKey;
          }
          else
          {
            // Use company updater data
            LicencaMatchIds companyUpdaterSpec = new(new List<Guid> { companyUpdaterLicenseId });
            IEnumerable<Licenca> companyUpdaterList = await _repository.GetListAsync<Licenca, Guid>(
              companyUpdaterSpec
            );
            Licenca? companyUpdater = companyUpdaterList.FirstOrDefault();

            if (companyUpdater == null)
            {
              return Response<UpdaterConfigurationDTO>.Fail("Company updater license not found");
            }

            // Always use company GSLP Manager for BaseUrl
            LicencaMatchIds companyGslpManagerSpec = new(
              new List<Guid> { companyGslpManagerLicenseId }
            );
            IEnumerable<Licenca> companyGslpManagerList = await _repository.GetListAsync<
              Licenca,
              Guid
            >(companyGslpManagerSpec);
            Licenca? companyGslpManager = companyGslpManagerList.FirstOrDefault();

            if (companyGslpManager == null || string.IsNullOrEmpty(companyGslpManager.Url2))
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company GSLP Manager license not found or missing BaseUrl (Url2)"
              );
            }
            licensesApiBaseUrl = companyGslpManager.Url2;

            if (
              companyUpdater.LicencaAPIKey == null
              || string.IsNullOrEmpty(companyUpdater.LicencaAPIKey.APIKey)
            )
            {
              return Response<UpdaterConfigurationDTO>.Fail(
                "Company updater license API key not found or is empty"
              );
            }
            licensesApiKey = companyUpdater.LicencaAPIKey.APIKey;
          }

          // For non-updater licenses, clients array contains only the requested license
          clientsList = new List<Licenca> { requestedLicenca };
        }

        // Step 3: Get logging configuration from appsettings
        string logLevelDefault = _configuration["Logging:LogLevel:Default"] ?? "Information";
        string logLevelAspNetCore =
          _configuration["Logging:LogLevel:Microsoft.AspNetCore"] ?? "Warning";
        string allowedHosts = _configuration["AllowedHosts"] ?? "*";

        // Step 4: Map licenses to updater configuration with full structure
        UpdaterConfigurationDTO config = new()
        {
          Logging = new LoggingDTO
          {
            LogLevel = new LogLevelDTO
            {
              Default = logLevelDefault,
              MicrosoftAspNetCore = logLevelAspNetCore,
            },
          },
          AllowedHosts = allowedHosts,
          Updater = new UpdaterSectionDTO
          {
            LicensesApi = new LicensesApiDTO
            {
              BaseUrl = licensesApiBaseUrl,
              ApiKey = licensesApiKey,
            },
            Clients = clientsList
              .Select(l =>
              {
                UpdaterClientDTO client = new()
                {
                  LicenseId = l.Id.ToString(),
                  FrontendPath = l.FrontendPath,
                  ApiPath = l.ApiPath,
                };

                // Only include Iis if at least one field exists
                if (
                  !string.IsNullOrEmpty(l.ApiPoolName) || !string.IsNullOrEmpty(l.FrontendPoolName)
                )
                {
                  client.Iis = new UpdaterIisDTO
                  {
                    ApiPoolName = l.ApiPoolName,
                    FrontendPoolName = l.FrontendPoolName,
                  };
                }

                return client;
              })
              .ToList(),
            Security = new SecurityDTO
            {
              ApiKey = string.Empty,
              AllowedIpAddresses = new List<string> { "127.0.0.1", "::1" },
            },
            Backup = new BackupDTO { Enabled = true, RetentionCount = 3 },
            Cleanup = new CleanupDTO { CleanBeforeCopy = true },
          },
        };

        return Response<UpdaterConfigurationDTO>.Success(config);
      }
      catch (Exception ex)
      {
        return Response<UpdaterConfigurationDTO>.Fail(ex.Message);
      }
    }

    // get frontend configuration for a license
    public async Task<Response<FrontendConfigDTO>> GetFrontendConfigResponseAsync(Guid licencaId)
    {
      try
      {
        // Get license with all includes (Aplicacao, Cliente, LicencaAPIKey)
        LicencaAddAllIncludes specification = new();
        Licenca licenca = await _repository.GetByIdAsync(licencaId, specification);

        if (licenca == null)
        {
          return Response<FrontendConfigDTO>.Fail("Licença não encontrada");
        }

        // Validate that license has an ApiKey
        if (licenca.LicencaAPIKey == null || string.IsNullOrEmpty(licenca.LicencaAPIKey.APIKey))
        {
          return Response<FrontendConfigDTO>.Fail("A licença não possui API key");
        }

        // Get application ID for URL mapping
        string? aplicacaoId = licenca.AplicacaoId.ToString();

        // Map URLs based on application type
        FrontendConfigUrls mappedUrls = FrontendConfigUrlMapper.MapUrlsToFrontendConfig(
          licenca,
          aplicacaoId
        );

        // Generate config object
        FrontendConfigDTO config = new()
        {
          ApiKey = licenca.LicencaAPIKey.APIKey,
          UrlApiHttp = mappedUrls.UrlApiHttp,
          UrlApiHttps = mappedUrls.UrlApiHttps,
          UrlAccessControlHttp = mappedUrls.UrlAccessControlHttp,
          UrlAccessControlHttps = mappedUrls.UrlAccessControlHttps,
          UpdaterApiUrlHttp = mappedUrls.UpdaterApiUrlHttp,
          UpdaterApiUrlHttps = mappedUrls.UpdaterApiUrlHttps,
          UpdaterApiKey = "gS_Upd@ter-2025!_K3y#A9", // Fixed value
          ClientKey = licenca.ClienteId.ToString(),
          LicencaId = licenca.Id.ToString(),
          EncryptionKey = licenca.LicencaAPIKey.APIKey, // Same as ApiKey
        };

        return Response<FrontendConfigDTO>.Success(config);
      }
      catch (Exception ex)
      {
        return Response<FrontendConfigDTO>.Fail(ex.Message);
      }
    }

    // get API configuration for a license
    public async Task<Response<ApiConfigDTO>> GetApiConfigResponseAsync(Guid licencaId)
    {
      try
      {
        // Get license with all includes (Aplicacao, Cliente)
        LicencaAddAllIncludes specification = new();
        Licenca licenca = await _repository.GetByIdAsync(licencaId, specification);

        if (licenca == null)
        {
          return Response<ApiConfigDTO>.Fail("Licença não encontrada");
        }

        // Generate database name from ApiPoolName or license name
        string databaseName = ApiConfigHelper.GenerateDatabaseName(
          licenca.ApiPoolName,
          licenca.Nome
        );

        // Generate connection string
        string connectionString =
          $"Server=localhost;Database={databaseName};User Id=sa;Password=pISI8LLup28YigA5cdfA5YFco6HaU6jp;TrustServerCertificate=true;MultipleActiveResultSets=true;";

        // Generate config object
        ApiConfigDTO config = new()
        {
          ConnectionStrings = new ConnectionStringsConfigDTO
          {
            DefaultConnection = connectionString,
          },
          Logging = new LoggingConfigDTO
          {
            LogLevel = new LogLevelConfigDTO
            {
              Default = "Information",
              MicrosoftAspNetCore = "Warning",
            },
          },
          AllowedHosts = "*",
          JWTSettings = new JwtSettingsConfigDTO
          {
            Key =
              "pdXSUQwgirPbJfhMGZHJtEof5Dl36lXEoxZ4PvTIXew0IA39ObaHbqvabI47zMHEmbE6voCloq4zZWwGmq5mROA9qxT4Liy1c9Z0zDPPKX91mtBOuddMGPUVUXmjlJIxcGBWpaR5X3afygBjPjum7iXSMjcXxEaVwT6gXsa4WqMCx43ssulMIx5rdUCjwAVKqm089zYRCI2QdiT0UFIaV81erFhC0CJCCP9d6LPMy5pBJZrFlROwbeAvHpH6Fbmp",
            Issuer = "CoreIdentity",
            Audience = "CoreIdentityUser",
            AuthTokenDurationInMinutes = 30,
            RefreshTokenDurationInDays = 14,
          },
          MailSettings = new MailSettingsConfigDTO
          {
            DisplayName = string.Empty,
            From = string.Empty,
            Host = string.Empty,
            Password = string.Empty,
            Port = 0,
            UserName = string.Empty,
          },
          Cloudinary = new CloudinaryConfigDTO
          {
            CloudName = string.Empty,
            ApiKey = string.Empty,
            ApiSecret = string.Empty,
            ApiBaseAddress = string.Empty,
          },
          EncryptionSettings = new EncryptionSettingsConfigDTO
          {
            EncryptionKey = "wtM#5GT@spHNC?V5", // Fixed value
          },
          RateLimiting = new RateLimitingConfigDTO
          {
            MaxRequests = 100,
            WindowSeconds = 60,
            ExcludedPaths = Array.Empty<string>(), // Empty array
          },
        };

        return Response<ApiConfigDTO>.Success(config);
      }
      catch (Exception ex)
      {
        return Response<ApiConfigDTO>.Fail(ex.Message);
      }
    }

    #endregion [-- LICENCA - API METHODS --]

    #region [-- LICENCA - INTERNAL METHODS --]

    #endregion [-- LICENCA - INTERNAL METHODS --]

    #region [-- LICENCA - PUBLIC METHODS --]

    // get licenca by APIKey
    public async Task<LicencaDTO?> GetLicencaByAPIKeyAsync(string APIKey)
    {
      try
      {
        // Create the specification that retrieves Licenca based on the APIKey
        LicencaMatchAPIKey licencaMatchAPIKey = new(APIKey);

        // Retrieve the Licenca using the specification
        LicencaDTO licenca = await _repository.FirstOrDefaultAsync<Licenca, LicencaDTO, Guid>(
          licencaMatchAPIKey
        );

        return licenca;
      }
      catch (Exception)
      {
        return null;
      }
    }

    #endregion [-- LICENCA - PUBLIC METHODS --]
  }
}
