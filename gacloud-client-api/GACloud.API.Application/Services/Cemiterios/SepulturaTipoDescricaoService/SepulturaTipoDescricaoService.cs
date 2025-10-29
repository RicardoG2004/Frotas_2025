using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Filters;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a SepulturaTipoDescricao domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<SepulturaTipoDescricao> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a SepulturaTiposDescricao api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService
{
  public class SepulturaTipoDescricaoService(IRepositoryAsync repository, IMapper mapper)
    : ISepulturaTipoDescricaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<
      Response<IEnumerable<SepulturaTipoDescricaoDTO>>
    > GetSepulturaTiposDescricaoAsync(string keyword = "")
    {
      SepulturaTipoDescricaoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SepulturaTipoDescricaoDTO> list = await _repository.GetListAsync<
        SepulturaTipoDescricao,
        SepulturaTipoDescricaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<SepulturaTipoDescricaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<
      PaginatedResponse<SepulturaTipoDescricaoDTO>
    > GetSepulturaTiposDescricaoPaginatedAsync(
      SepulturaTipoDescricaoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SepulturaTipoDescricaoSearchTable specification = new(
        filter.Filters ?? [],
        dynamicOrder
      ); // ardalis specification
      PaginatedResponse<SepulturaTipoDescricaoDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          SepulturaTipoDescricao,
          SepulturaTipoDescricaoDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single SepulturaTipoDescricao by Id
    public async Task<
      Response<SepulturaTipoDescricaoDTO>
    > GetSepulturaTipoDescricaoAsync(Guid id)
    {
      try
      {
        SepulturaTipoDescricaoDTO dto = await _repository.GetByIdAsync<
          SepulturaTipoDescricao,
          SepulturaTipoDescricaoDTO,
          Guid
        >(id);
        return Response<SepulturaTipoDescricaoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<SepulturaTipoDescricaoDTO>.Fail(ex.Message);
      }
    }

    // create new SepulturaTipoDescricao
    public async Task<Response<Guid>> CreateSepulturaTipoDescricaoAsync(
      CreateSepulturaTipoDescricaoRequest request
    )
    {
      SepulturaTipoDescricaoMatchName specification = new(request.Descricao); // ardalis specification
      bool SepulturaTipoDescricaoExists = await _repository.ExistsAsync<
        SepulturaTipoDescricao,
        Guid
      >(specification);
      if (SepulturaTipoDescricaoExists)
      {
        return Response<Guid>.Fail("SepulturaTipoDescricao already exists");
      }

      SepulturaTipoDescricao newSepulturaTipoDescricao = _mapper.Map(
        request,
        new SepulturaTipoDescricao()
      ); // map dto to domain entity

      try
      {
        SepulturaTipoDescricao response = await _repository.CreateAsync<
          SepulturaTipoDescricao,
          Guid
        >(newSepulturaTipoDescricao); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update SepulturaTipoDescricao
    public async Task<Response<Guid>> UpdateSepulturaTipoDescricaoAsync(
      UpdateSepulturaTipoDescricaoRequest request,
      Guid id
    )
    {
      SepulturaTipoDescricao SepulturaTipoDescricaoInDb =
        await _repository.GetByIdAsync<SepulturaTipoDescricao, Guid>(id); // get existing entity
      if (SepulturaTipoDescricaoInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      SepulturaTipoDescricao updatedSepulturaTipoDescricao = _mapper.Map(
        request,
        SepulturaTipoDescricaoInDb
      ); // map dto to domain entity

      try
      {
        SepulturaTipoDescricao response = await _repository.UpdateAsync<
          SepulturaTipoDescricao,
          Guid
        >(updatedSepulturaTipoDescricao); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete SepulturaTipoDescricao
    public async Task<Response<Guid>> DeleteSepulturaTipoDescricaoAsync(Guid id)
    {
      try
      {
        SepulturaTipoDescricao? SepulturaTipoDescricao =
          await _repository.RemoveByIdAsync<SepulturaTipoDescricao, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(SepulturaTipoDescricao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple SepulturaTipoDescricoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturaTipoDescricoesAsync(
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
            SepulturaTipoDescricao? entity = await _repository.GetByIdAsync<SepulturaTipoDescricao, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Tipo de sepultura descrição com ID {id}");
              continue;
            }

            // Try to delete the entity
            SepulturaTipoDescricao? deletedEntity = await _repository.RemoveByIdAsync<SepulturaTipoDescricao, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Tipo de sepultura descrição com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Tipo de sepultura descrição com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} tipos de sepultura descrição.";
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

