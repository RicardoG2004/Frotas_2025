using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Base.CodigoPostalService.DTOs;
using GACloud.API.Application.Services.Base.CodigoPostalService.Filters;
using GACloud.API.Application.Services.Base.CodigoPostalService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a CodigoPostal domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<CodigoPostal> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a CodigosPostais api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Base.CodigoPostalService
{
  public class CodigoPostalService(IRepositoryAsync repository, IMapper mapper)
    : ICodigoPostalService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<CodigoPostalDTO>>> GetCodigosPostaisAsync(
      string keyword = ""
    )
    {
      CodigoPostalSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CodigoPostalDTO> list = await _repository.GetListAsync<
        CodigoPostal,
        CodigoPostalDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<CodigoPostalDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CodigoPostalDTO>> GetCodigosPostaisPaginatedAsync(
      CodigoPostalTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CodigoPostalSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CodigoPostalDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        CodigoPostal,
        CodigoPostalDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single CodigoPostal by Id
    public async Task<Response<CodigoPostalDTO>> GetCodigoPostalAsync(Guid id)
    {
      try
      {
        CodigoPostalDTO dto = await _repository.GetByIdAsync<CodigoPostal, CodigoPostalDTO, Guid>(
          id
        );
        return Response<CodigoPostalDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CodigoPostalDTO>.Fail(ex.Message);
      }
    }

    // create new CodigoPostal
    public async Task<Response<Guid>> CreateCodigoPostalAsync(CreateCodigoPostalRequest request)
    {
      CodigoPostalMatchCodigo specification = new(request.Codigo); // ardalis specification
      bool CodigoPostalExists = await _repository.ExistsAsync<CodigoPostal, Guid>(specification);
      if (CodigoPostalExists)
      {
        return Response<Guid>.Fail("Já existe um código postal com o código fornecido");
      }

      CodigoPostal newCodigoPostal = _mapper.Map(request, new CodigoPostal()); // map dto to domain entity

      try
      {
        CodigoPostal response = await _repository.CreateAsync<CodigoPostal, Guid>(newCodigoPostal); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update CodigoPostal
    public async Task<Response<Guid>> UpdateCodigoPostalAsync(
      UpdateCodigoPostalRequest request,
      Guid id
    )
    {
      CodigoPostal CodigoPostalInDb = await _repository.GetByIdAsync<CodigoPostal, Guid>(id); // get existing entity
      if (CodigoPostalInDb == null)
      {
        return Response<Guid>.Fail("Código Postal não encontrado");
      }

      CodigoPostal updatedCodigoPostal = _mapper.Map(request, CodigoPostalInDb); // map dto to domain entity

      try
      {
        CodigoPostal response = await _repository.UpdateAsync<CodigoPostal, Guid>(
          updatedCodigoPostal
        ); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete CodigoPostal
    public async Task<Response<Guid>> DeleteCodigoPostalAsync(Guid id)
    {
      try
      {
        CodigoPostal? CodigoPostal = await _repository.RemoveByIdAsync<CodigoPostal, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(CodigoPostal.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple CodigosPostais
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCodigosPostaisAsync(
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
            CodigoPostal? entity = await _repository.GetByIdAsync<CodigoPostal, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Código Postal com ID {id}");
              continue;
            }

            // Try to delete the entity
            CodigoPostal? deletedEntity = await _repository.RemoveByIdAsync<CodigoPostal, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Código Postal com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Código Postal com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} códigos postais.";
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
