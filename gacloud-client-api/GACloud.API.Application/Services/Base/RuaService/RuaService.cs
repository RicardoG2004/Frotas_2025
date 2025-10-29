using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.RuaService.DTOs;
using GACloud.API.Application.Services.Base.RuaService.Filters;
using GACloud.API.Application.Services.Base.RuaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Rua domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Rua> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Ruas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.RuaService
{
  public class RuaService(IRepositoryAsync repository, IMapper mapper) : IRuaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<RuaDTO>>> GetRuasAsync(string keyword = "")
    {
      RuaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<RuaDTO> list = await _repository.GetListAsync<Rua, RuaDTO, Guid>(specification); // full list, entity mapped to dto
      return Response<IEnumerable<RuaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<RuaDTO>> GetRuasPaginatedAsync(RuaTableFilter filter)
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      RuaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<RuaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Rua,
        RuaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Rua by Id
    public async Task<Response<RuaDTO>> GetRuaAsync(Guid id)
    {
      try
      {
        RuaDTO dto = await _repository.GetByIdAsync<Rua, RuaDTO, Guid>(id);
        return Response<RuaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<RuaDTO>.Fail(ex.Message);
      }
    }

    // create new Rua
    public async Task<Response<Guid>> CreateRuaAsync(CreateRuaRequest request)
    {
      // First check if freguesia exists
      try
      {
        _ = await _repository.GetByIdAsync<Freguesia, Guid>(Guid.Parse(request.FreguesiaId));
      }
      catch (Exception)
      {
        return Response<Guid>.Fail("A freguesia não foi encontrada");
      }

      // Then check if codigo postal exists
      try
      {
        _ = await _repository.GetByIdAsync<CodigoPostal, Guid>(Guid.Parse(request.CodigoPostalId));
      }
      catch (Exception)
      {
        return Response<Guid>.Fail("O código postal não foi encontrado");
      }

      // Check if rua name already exists in the same freguesia and codigo postal
      RuaMatchNameAndLocation specification = new(
        request.Nome,
        Guid.Parse(request.FreguesiaId),
        Guid.Parse(request.CodigoPostalId)
      );
      bool RuaExists = await _repository.ExistsAsync<Rua, Guid>(specification);
      if (RuaExists)
      {
        return Response<Guid>.Fail(
          "Já existe uma rua com o nome fornecido na mesma freguesia e código postal"
        );
      }

      Rua newRua = _mapper.Map(request, new Rua());

      try
      {
        Rua response = await _repository.CreateAsync<Rua, Guid>(newRua);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Rua
    public async Task<Response<Guid>> UpdateRuaAsync(UpdateRuaRequest request, Guid id)
    {
      Rua RuaInDb = await _repository.GetByIdAsync<Rua, Guid>(id);
      if (RuaInDb == null)
      {
        return Response<Guid>.Fail("Rua não encontrada");
      }

      // First check if freguesia exists
      try
      {
        _ = await _repository.GetByIdAsync<Freguesia, Guid>(Guid.Parse(request.FreguesiaId));
      }
      catch (Exception)
      {
        return Response<Guid>.Fail("A freguesia não foi encontrada");
      }

      // Then check if codigo postal exists
      try
      {
        _ = await _repository.GetByIdAsync<CodigoPostal, Guid>(Guid.Parse(request.CodigoPostalId));
      }
      catch (Exception)
      {
        return Response<Guid>.Fail("O código postal não foi encontrado");
      }

      // Check if another rua exists with same name in same freguesia and codigo postal (excluding current rua)
      RuaMatchNameAndLocation specification = new(
        request.Nome,
        Guid.Parse(request.FreguesiaId),
        Guid.Parse(request.CodigoPostalId)
      );
      bool RuaExists = await _repository.ExistsAsync<Rua, Guid>(specification);
      if (RuaExists && RuaInDb.Nome != request.Nome)
      {
        return Response<Guid>.Fail(
          "Já existe uma rua com o nome fornecido na mesma freguesia e código postal"
        );
      }

      Rua updatedRua = _mapper.Map(request, RuaInDb);

      try
      {
        Rua response = await _repository.UpdateAsync<Rua, Guid>(updatedRua);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Rua
    public async Task<Response<Guid>> DeleteRuaAsync(Guid id)
    {
      try
      {
        Rua? Rua = await _repository.RemoveByIdAsync<Rua, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Rua.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Ruas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleRuasAsync(IEnumerable<Guid> ids)
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
            Rua? entity = await _repository.GetByIdAsync<Rua, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Rua com ID {id}");
              continue;
            }

            // Try to delete the entity
            Rua? deletedEntity = await _repository.RemoveByIdAsync<Rua, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Rua com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Rua com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} ruas.";
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
