using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeContactoService.Filters;
using GACloud.API.Application.Services.Base.EntidadeContactoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;

// After creating this service:
// -- 1. Create a EntidadeContacto domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<EntidadeContacto> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a EntidadeContactos api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.EntidadeContactoService
{
  public class EntidadeContactoService(IRepositoryAsync repository, IMapper mapper)
    : IEntidadeContactoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<EntidadeContactoDTO>>> GetEntidadeContactosAsync(
      string keyword = ""
    )
    {
      EntidadeContactoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<EntidadeContactoDTO> list = await _repository.GetListAsync<
        EntidadeContacto,
        EntidadeContactoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<EntidadeContactoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<EntidadeContactoDTO>> GetEntidadeContactosPaginatedAsync(
      EntidadeContactoTableFilter filter
    )
    {
      if (!string.IsNullOrEmpty(filter.Keyword)) // set to first page if any search filters are applied
      {
        filter.PageNumber = 1;
      }

      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      EntidadeContactoSearchTable specification = new(filter?.Keyword, dynamicOrder); // ardalis specification
      PaginatedResponse<EntidadeContactoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<EntidadeContacto, EntidadeContactoDTO, Guid>(
          filter.PageNumber,
          filter.PageSize,
          specification
        ); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single EntidadeContacto by Id
    public async Task<Response<EntidadeContactoDTO>> GetEntidadeContactoAsync(Guid id)
    {
      try
      {
        EntidadeContactoDTO dto = await _repository.GetByIdAsync<
          EntidadeContacto,
          EntidadeContactoDTO,
          Guid
        >(id);
        return Response<EntidadeContactoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<EntidadeContactoDTO>.Fail(ex.Message);
      }
    }

    // create new EntidadeContacto
    public async Task<Response<Guid>> CreateEntidadeContactoAsync(
      CreateEntidadeContactoRequest request
    )
    {
      Guid entidadeId = Guid.Parse(request.EntidadeId);

      EntidadeContactoMatchTipo specification = new(entidadeId, request.EntidadeContactoTipoId);
      bool contactTypeExists = await _repository.ExistsAsync<EntidadeContacto, Guid>(specification);

      if (contactTypeExists)
      {
        return Response<Guid>.Fail("O tipo de contacto já existe para esta entidade");
      }

      EntidadeContacto newEntidadeContacto = _mapper.Map(request, new EntidadeContacto());

      try
      {
        EntidadeContacto response = await _repository.CreateAsync<EntidadeContacto, Guid>(
          newEntidadeContacto
        );
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Falha ao criar contacto '{request.Valor}': {ex.Message}");
      }
    }

    // create new EntidadeContactoBulk
    public async Task<Response<IEnumerable<Guid>>> CreateEntidadeContactoBulkAsync(
      CreateEntidadeContactoBulkRequest request
    )
    {
      List<Guid> createdIds = [];
      List<string> errors = [];
      Guid entidadeId = Guid.Parse(request.EntidadeId);

      foreach (CreateEntidadeContactoItemRequest contact in request.Contactos)
      {
        EntidadeContactoMatchTipo specification = new(entidadeId, contact.EntidadeContactoTipoId);
        bool contactTypeExists = await _repository.ExistsAsync<EntidadeContacto, Guid>(
          specification
        );

        if (contactTypeExists)
        {
          errors.Add(
            $"O tipo de contacto com ID '{contact.EntidadeContactoTipoId}' já existe para esta entidade"
          );
          continue;
        }

        EntidadeContacto newContact = new()
        {
          EntidadeId = entidadeId,
          EntidadeContactoTipoId = contact.EntidadeContactoTipoId,
          Valor = contact.Valor,
          Principal = contact.Principal,
        };

        try
        {
          EntidadeContacto response = await _repository.CreateAsync<EntidadeContacto, Guid>(
            newContact
          );
          createdIds.Add(response.Id);
        }
        catch (Exception ex)
        {
          errors.Add($"Falha ao criar contacto '{contact.Valor}': {ex.Message}");
        }
      }

      _ = await _repository.SaveChangesAsync();

      return errors.Count != 0
        ? Response<IEnumerable<Guid>>.Fail(string.Join("; ", errors))
        : Response<IEnumerable<Guid>>.Success(createdIds);
    }

    // update EntidadeContacto
    public async Task<Response<Guid>> UpdateEntidadeContactoAsync(
      UpdateEntidadeContactoRequest request,
      Guid id
    )
    {
      EntidadeContacto EntidadeContactoInDb = await _repository.GetByIdAsync<
        EntidadeContacto,
        Guid
      >(id); // get existing entity
      if (EntidadeContactoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      EntidadeContacto updatedEntidadeContacto = _mapper.Map(request, EntidadeContactoInDb); // map dto to domain entity

      try
      {
        EntidadeContacto response = await _repository.UpdateAsync<EntidadeContacto, Guid>(
          updatedEntidadeContacto
        ); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Falha ao atualizar contacto '{id}': {ex.Message}");
      }
    }

    // delete EntidadeContacto
    public async Task<Response<Guid>> DeleteEntidadeContactoAsync(Guid id)
    {
      try
      {
        EntidadeContacto? EntidadeContacto = await _repository.RemoveByIdAsync<
          EntidadeContacto,
          Guid
        >(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(EntidadeContacto.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail($"Falha ao excluir contacto '{id}': {ex.Message}");
      }
    }

    public async Task<Response<IEnumerable<Guid>>> UpdateEntidadeContactoBulkAsync(
      UpdateEntidadeContactoBulkRequest request
    )
    {
      List<Guid> updatedIds = [];
      List<string> errors = [];
      Guid entidadeId = Guid.Parse(request.EntidadeId);

      foreach (UpdateEntidadeContactoItemRequest contacto in request.Contactos)
      {
        EntidadeContacto contactInDb = await _repository.GetByIdAsync<EntidadeContacto, Guid>(
          contacto.Id
        );

        if (contactInDb == null)
        {
          errors.Add($"Contacto com ID '{contacto.Id}' não encontrado");
          continue;
        }

        if (contactInDb.EntidadeId != entidadeId)
        {
          errors.Add($"Contacto com ID '{contacto.Id}' não pertence a esta entidade");
          continue;
        }

        // Simply update the valor and principal flag
        contactInDb.Valor = contacto.Valor;
        contactInDb.Principal = contacto.Principal;

        try
        {
          EntidadeContacto response;
          try
          {
            response = await _repository.UpdateAsync<EntidadeContacto, Guid>(contactInDb);
          }
          catch (Exception ex) when (ex.Message.Contains("Nada a ser atualizado"))
          {
            // If no changes to contact, use the existing contact
            response = contactInDb;
          }
          updatedIds.Add(response.Id);
        }
        catch (Exception ex)
        {
          errors.Add($"Falha ao atualizar contacto '{contacto.Id}': {ex.Message}");
        }
      }

      _ = await _repository.SaveChangesAsync();

      return errors.Count != 0
        ? Response<IEnumerable<Guid>>.Fail(string.Join("; ", errors))
        : Response<IEnumerable<Guid>>.Success(updatedIds);
    }

    public async Task<Response<IEnumerable<Guid>>> UpsertEntidadeContactoBulkAsync(
      UpsertEntidadeContactoBulkRequest request
    )
    {
      List<Guid> processedIds = [];
      List<string> errors = [];
      Guid entidadeId = Guid.Parse(request.EntidadeId);

      // Get all existing contacts for this entity
      EntidadeContactoSearchByEntidade searchSpec = new(entidadeId);
      IEnumerable<EntidadeContacto> existingContacts = await _repository.GetListAsync<
        EntidadeContacto,
        Guid
      >(searchSpec);

      // Track which contact types are in the request
      HashSet<int> requestedContactTypes = request
        .Contactos.Select(c => c.EntidadeContactoTipoId)
        .ToHashSet();

      // Process incoming contacts (update or create)
      foreach (UpsertEntidadeContactoItemRequest contact in request.Contactos)
      {
        EntidadeContactoMatchTipo specification = new(entidadeId, contact.EntidadeContactoTipoId);
        bool contactTypeExists = await _repository.ExistsAsync<EntidadeContacto, Guid>(
          specification
        );

        try
        {
          if (contactTypeExists)
          {
            // Update existing contact
            IEnumerable<EntidadeContacto> matchingContacts = await _repository.GetListAsync<
              EntidadeContacto,
              Guid
            >(specification);
            EntidadeContacto existingContact = matchingContacts.First();
            existingContact.Valor = contact.Valor;
            existingContact.Principal = contact.Principal;

            EntidadeContacto response;
            try
            {
              response = await _repository.UpdateAsync<EntidadeContacto, Guid>(existingContact);
            }
            catch (Exception ex) when (ex.Message.Contains("Nada a ser atualizado"))
            {
              // If no changes to contact, use the existing contact
              response = existingContact;
            }
            processedIds.Add(response.Id);
          }
          else
          {
            // Create new contact
            EntidadeContacto newContact = new()
            {
              EntidadeId = entidadeId,
              EntidadeContactoTipoId = contact.EntidadeContactoTipoId,
              Valor = contact.Valor,
              Principal = contact.Principal,
            };

            EntidadeContacto response = await _repository.CreateAsync<EntidadeContacto, Guid>(
              newContact
            );
            processedIds.Add(response.Id);
          }
        }
        catch (Exception ex)
        {
          errors.Add(
            $"Falha ao processar tipo de contacto '{contact.EntidadeContactoTipoId}': {ex.Message}"
          );
        }
      }

      // Delete contacts that exist in DB but are not in the request
      foreach (EntidadeContacto existingContact in existingContacts)
      {
        if (!requestedContactTypes.Contains(existingContact.EntidadeContactoTipoId))
        {
          try
          {
            await _repository.RemoveByIdAsync<EntidadeContacto, Guid>(existingContact.Id);
          }
          catch (Exception ex)
          {
            errors.Add(
              $"Falha ao excluir contacto '{existingContact.EntidadeContactoTipoId}': {ex.Message}"
            );
          }
        }
      }

      _ = await _repository.SaveChangesAsync();

      return errors.Count != 0
        ? Response<IEnumerable<Guid>>.Fail(string.Join("; ", errors))
        : Response<IEnumerable<Guid>>.Success(processedIds);
    }
  }
}
