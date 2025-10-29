using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EpocaService.DTOs;
using GACloud.API.Application.Services.Base.EpocaService.Filters;
using GACloud.API.Application.Services.Base.EpocaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Epoca domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Epoca> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Epocas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.EpocaService
{
  public class EpocaService(IRepositoryAsync repository, IMapper mapper) : IEpocaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<EpocaDTO>>> GetEpocasAsync(string keyword = "")
    {
      EpocaSearchList specification = new(keyword);
      IEnumerable<EpocaDTO> list = await _repository.GetListAsync<Epoca, EpocaDTO, Guid>(
        specification
      );

      return Response<IEnumerable<EpocaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<EpocaDTO>> GetEpocasPaginatedAsync(EpocaTableFilter filter)
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      EpocaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<EpocaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Epoca,
        EpocaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto

      return pagedResponse;
    }

    // get single Epoca by Id
    public async Task<Response<EpocaDTO>> GetEpocaAsync(Guid id)
    {
      try
      {
        EpocaDTO dto = await _repository.GetByIdAsync<Epoca, EpocaDTO, Guid>(id);
        return Response<EpocaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<EpocaDTO>.Fail(ex.Message);
      }
    }

    private async Task UnsetOtherPredefinidas()
    {
      EpocaPredefinidaSpec specification = new();
      IEnumerable<Epoca> predefinidas = await _repository.GetListAsync<Epoca, Guid>(specification);

      foreach (Epoca epoca in predefinidas)
      {
        epoca.Predefinida = false;
        _ = await _repository.UpdateAsync<Epoca, Guid>(epoca);
      }
    }

    // create new Epoca
    public async Task<Response<Guid>> CreateEpocaAsync(CreateEpocaRequest request)
    {
      EpocaMatchDescricao specification = new(request.Descricao);
      bool EpocaExists = await _repository.ExistsAsync<Epoca, Guid>(specification);
      if (EpocaExists)
      {
        return Response<Guid>.Fail("Epoca already exists");
      }

      Epoca newEpoca = _mapper.Map(request, new Epoca());

      try
      {
        if (request.Predefinida)
        {
          await UnsetOtherPredefinidas();
        }

        Epoca response = await _repository.CreateAsync<Epoca, Guid>(newEpoca);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Epoca
    public async Task<Response<Guid>> UpdateEpocaAsync(UpdateEpocaRequest request, Guid id)
    {
      Epoca EpocaInDb = await _repository.GetByIdAsync<Epoca, Guid>(id);
      if (EpocaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      try
      {
        if (request.Predefinida && !EpocaInDb.Predefinida)
        {
          await UnsetOtherPredefinidas();
        }

        Epoca updatedEpoca = _mapper.Map(request, EpocaInDb);
        Epoca response = await _repository.UpdateAsync<Epoca, Guid>(updatedEpoca);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Epoca
    public async Task<Response<Guid>> DeleteEpocaAsync(Guid id)
    {
      try
      {
        Epoca? Epoca = await _repository.RemoveByIdAsync<Epoca, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Epoca.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<EpocaDTO>> GetEpocaPredefinidaAsync()
    {
      try
      {
        EpocaPredefinidaSpec specification = new();
        IEnumerable<EpocaDTO> list = await _repository.GetListAsync<Epoca, EpocaDTO, Guid>(
          specification
        );
        EpocaDTO? epocaPredefinida = list.FirstOrDefault();

        if (epocaPredefinida == null)
        {
          return Response<EpocaDTO>.Fail("No predefined Epoca found");
        }

        return Response<EpocaDTO>.Success(epocaPredefinida);
      }
      catch (Exception ex)
      {
        return Response<EpocaDTO>.Fail(ex.Message);
      }
    }

    // delete multiple Epocas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleEpocasAsync(IEnumerable<Guid> ids)
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
            Epoca? entity = await _repository.GetByIdAsync<Epoca, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Época com ID {id}");
              continue;
            }

            // Try to delete the entity
            Epoca? deletedEntity = await _repository.RemoveByIdAsync<Epoca, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Época com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Época com ID {id}");

            // Clear the change tracker to reset the context state after a failed deletion
            // This prevents the failed deletion from affecting subsequent operations
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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} épocas.";
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
