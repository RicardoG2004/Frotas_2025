using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Frotas.AgenciaFunerariaService.DTOs;
using GACloud.API.Application.Services.Frotas.AgenciaFunerariaService.Filters;
using GACloud.API.Application.Services.Frotas.AgenciaFunerariaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a AgenciaFuneraria domain entity in GACloud.API.Domain/Entities/Frotas
// -- 2. Add DbSet<AgenciaFuneraria> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a CemiterioAgenciasFunerarias api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Frotas.AgenciaFunerariaService
{
  public class AgenciaFunerariaService(IRepositoryAsync repository, IMapper mapper)
    : IAgenciaFunerariaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<
      Response<IEnumerable<AgenciaFunerariaDTO>>
    > GetAgenciasFunerariasAsync(string keyword = "")
    {
      AgenciaFunerariaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<AgenciaFunerariaDTO> list = await _repository.GetListAsync<
        AgenciaFuneraria,
        AgenciaFunerariaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<AgenciaFunerariaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<
      PaginatedResponse<AgenciaFunerariaDTO>
    > GetAgenciasFunerariasPaginatedAsync(AgenciaFunerariaTableFilter filter)
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      AgenciaFunerariaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<AgenciaFunerariaDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          AgenciaFuneraria,
          AgenciaFunerariaDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single AgenciaFuneraria by Id
    public async Task<Response<AgenciaFunerariaDTO>> GetAgenciaFunerariaAsync(
      Guid id
    )
    {
      try
      {
        AgenciaFunerariaDTO dto = await _repository.GetByIdAsync<
          AgenciaFuneraria,
          AgenciaFunerariaDTO,
          Guid
        >(id);
        return Response<AgenciaFunerariaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<AgenciaFunerariaDTO>.Fail(ex.Message);
      }
    }

    // create new AgenciaFuneraria
    public async Task<Response<Guid>> CreateAgenciaFunerariaAsync(
      CreateAgenciaFunerariaRequest request
    )
    {
      try
      {
        // Check if EntidadeId is already associated with an agencia funeraria
        IEnumerable<AgenciaFuneraria> existingCemiterioAgenciasFunerarias =
          await _repository.GetListAsync<AgenciaFuneraria, Guid>(
            new AgenciaFunerariaMatchEntidade(Guid.Parse(request.EntidadeId))
          );
        AgenciaFuneraria? existingAgenciaFuneraria =
          existingCemiterioAgenciasFunerarias.FirstOrDefault();
        if (existingAgenciaFuneraria != null)
        {
          return Response<Guid>.Fail("Já existe uma agência funerária associada a esta entidade.");
        }

        AgenciaFuneraria newAgenciaFuneraria = _mapper.Map(
          request,
          new AgenciaFuneraria()
        ); // map dto to domain entity

        AgenciaFuneraria response = await _repository.CreateAsync<
          AgenciaFuneraria,
          Guid
        >(newAgenciaFuneraria); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update AgenciaFuneraria
    public async Task<Response<Guid>> UpdateAgenciaFunerariaAsync(
      UpdateAgenciaFunerariaRequest request,
      Guid id
    )
    {
      try
      {
        AgenciaFuneraria AgenciaFunerariaInDb = await _repository.GetByIdAsync<
          AgenciaFuneraria,
          Guid
        >(id); // get existing entity
        if (AgenciaFunerariaInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if EntidadeId is already associated with another agencia funeraria
        IEnumerable<AgenciaFuneraria> existingCemiterioAgenciasFunerarias =
          await _repository.GetListAsync<AgenciaFuneraria, Guid>(
            new AgenciaFunerariaMatchEntidade(Guid.Parse(request.EntidadeId))
          );
        AgenciaFuneraria? existingAgenciaFuneraria =
          existingCemiterioAgenciasFunerarias.FirstOrDefault();
        if (existingAgenciaFuneraria != null && existingAgenciaFuneraria.Id != id)
        {
          return Response<Guid>.Fail("Já existe uma agência funerária associada a esta entidade.");
        }

        AgenciaFuneraria updatedAgenciaFuneraria = _mapper.Map(
          request,
          AgenciaFunerariaInDb
        ); // map dto to domain entity

        AgenciaFuneraria response = await _repository.UpdateAsync<
          AgenciaFuneraria,
          Guid
        >(updatedAgenciaFuneraria); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete AgenciaFuneraria
    public async Task<Response<Guid>> DeleteAgenciaFunerariaAsync(Guid id)
    {
      try
      {
        AgenciaFuneraria? AgenciaFuneraria = await _repository.RemoveByIdAsync<
          AgenciaFuneraria,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(AgenciaFuneraria.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple CemiterioAgenciasFunerarias
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleAgenciasFunerariasAsync(
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
            AgenciaFuneraria? entity = await _repository.GetByIdAsync<
              AgenciaFuneraria,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Agência funerária com ID {id}");
              continue;
            }

            // Try to delete the entity
            AgenciaFuneraria? deletedEntity = await _repository.RemoveByIdAsync<
              AgenciaFuneraria,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Agência funerária com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Agência funerária com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} agências funerárias.";
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

