using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EntidadeContactoService;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeContactoService.Specifications;
using GACloud.API.Application.Services.Base.EntidadeService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeService.Filters;
using GACloud.API.Application.Services.Base.EntidadeService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Entidade domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Entidade> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Entidades api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.EntidadeService
{
  public class EntidadeService : IEntidadeService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;
    private readonly IEntidadeContactoService _entidadeContactoService;

    public EntidadeService(
      IRepositoryAsync repository,
      IMapper mapper,
      IEntidadeContactoService entidadeContactoService
    )
    {
      _repository = repository;
      _mapper = mapper;
      _entidadeContactoService = entidadeContactoService;
    }

    // get full List
    public async Task<Response<IEnumerable<EntidadeDTO>>> GetEntidadesAsync(string keyword = "")
    {
      EntidadeSearchList specification = new(keyword); // ardalis specification
      IEnumerable<EntidadeDTO> list = await _repository.GetListAsync<Entidade, EntidadeDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<EntidadeDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<EntidadeDTO>> GetEntidadesPaginatedAsync(
      EntidadeTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      EntidadeSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<EntidadeDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Entidade,
        EntidadeDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Entidade by Id
    public async Task<Response<EntidadeDTO>> GetEntidadeAsync(Guid id)
    {
      try
      {
        EntidadeDTO dto = await _repository.GetByIdAsync<Entidade, EntidadeDTO, Guid>(id);
        return Response<EntidadeDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<EntidadeDTO>.Fail(ex.Message);
      }
    }

    // create new Entidade
    public async Task<Response<Guid>> CreateEntidadeAsync(CreateEntidadeRequest request)
    {
      EntidadeMatchName specification = new(request.Nome); // ardalis specification
      bool EntidadeExists = await _repository.ExistsAsync<Entidade, Guid>(specification);
      if (EntidadeExists)
      {
        return Response<Guid>.Fail("Entidade already exists");
      }

      Entidade newEntidade = _mapper.Map(request, new Entidade()); // map dto to domain entity

      try
      {
        Entidade response = await _repository.CreateAsync<Entidade, Guid>(newEntidade); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db

        // If contacts are provided, create them
        if (request.Contactos != null && request.Contactos.Any())
        {
          var contactsRequest = new CreateEntidadeContactoBulkRequest
          {
            EntidadeId = response.Id.ToString(),
            Contactos = request.Contactos,
          };

          var contactsResult = await _entidadeContactoService.CreateEntidadeContactoBulkAsync(
            contactsRequest
          );
          if (contactsResult.Status != ResponseStatus.Success)
          {
            string errorMessage =
              contactsResult.Messages.ContainsKey("$") && contactsResult.Messages["$"].Any()
                ? contactsResult.Messages["$"].First()
                : "Unknown error occurred while creating contacts";

            return Response<Guid>.Fail(
              $"Entidade created but failed to create contacts: {errorMessage}"
            );
          }
        }

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Entidade
    public async Task<Response<Guid>> UpdateEntidadeAsync(UpdateEntidadeRequest request, Guid id)
    {
      Entidade EntidadeInDb = await _repository.GetByIdAsync<Entidade, Guid>(id); // get existing entity
      if (EntidadeInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      Entidade updatedEntidade = _mapper.Map(request, EntidadeInDb); // map dto to domain entity

      try
      {
        // Check if there are contact changes
        bool hasContactChanges = request.Contactos != null && request.Contactos.Any();

        // Try to update the main entity, but don't fail if there are no changes
        Entidade response;
        try
        {
          response = await _repository.UpdateAsync<Entidade, Guid>(updatedEntidade); // update entity
        }
        catch (Exception ex) when (ex.Message.Contains("Nada a ser atualizado"))
        {
          // If no changes to main entity, use the existing entity
          response = EntidadeInDb;
        }

        _ = await _repository.SaveChangesAsync(); // save changes to db

        // If contacts are provided, update them using upsert
        if (hasContactChanges)
        {
          var contactsRequest = new UpsertEntidadeContactoBulkRequest
          {
            EntidadeId = response.Id.ToString(),
            Contactos = request.Contactos,
          };

          var contactsResult = await _entidadeContactoService.UpsertEntidadeContactoBulkAsync(
            contactsRequest
          );
          if (contactsResult.Status != ResponseStatus.Success)
          {
            string errorMessage =
              contactsResult.Messages.ContainsKey("$") && contactsResult.Messages["$"].Any()
                ? contactsResult.Messages["$"].First()
                : "Unknown error occurred while updating contacts";

            return Response<Guid>.Fail(
              $"Entidade updated but failed to update contacts: {errorMessage}"
            );
          }
        }

        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Entidade
    public async Task<Response<Guid>> DeleteEntidadeAsync(Guid id)
    {
      try
      {
        // First, get all contacts for this entity
        EntidadeContactoSearchByEntidade specification = new(id);
        IEnumerable<EntidadeContacto> contacts = await _repository.GetListAsync<
          EntidadeContacto,
          Guid
        >(specification);

        // Delete each contact
        foreach (var contact in contacts)
        {
          var deleteResult = await _entidadeContactoService.DeleteEntidadeContactoAsync(contact.Id);
          if (deleteResult.Status != ResponseStatus.Success)
          {
            string errorMessage =
              deleteResult.Messages.ContainsKey("$") && deleteResult.Messages["$"].Any()
                ? deleteResult.Messages["$"].First()
                : "Unknown error occurred while deleting contact";

            return Response<Guid>.Fail($"Failed to delete contact {contact.Id}: {errorMessage}");
          }
        }

        // Now delete the entity
        Entidade? Entidade = await _repository.RemoveByIdAsync<Entidade, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Entidade.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Entidades
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleEntidadesAsync(
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
            Entidade? entity = await _repository.GetByIdAsync<Entidade, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Entidade com ID {id}");
              continue;
            }

            // First, get all contacts for this entity
            EntidadeContactoSearchByEntidade specification = new(id);
            IEnumerable<EntidadeContacto> contacts = await _repository.GetListAsync<
              EntidadeContacto,
              Guid
            >(specification);

            // Delete each contact
            bool contactsDeletedSuccessfully = true;
            foreach (var contact in contacts)
            {
              var deleteResult = await _entidadeContactoService.DeleteEntidadeContactoAsync(
                contact.Id
              );
              if (deleteResult.Status != ResponseStatus.Success)
              {
                contactsDeletedSuccessfully = false;
                break;
              }
            }

            if (!contactsDeletedSuccessfully)
            {
              failedDeletions.Add($"Entidade com ID {id}");
              _repository.ClearChangeTracker();
              continue;
            }

            // Now try to delete the entity
            Entidade? deletedEntity = await _repository.RemoveByIdAsync<Entidade, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Entidade com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Entidade com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} entidades.";
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
