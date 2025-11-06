using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.LocalizacaoService.DTOs;
using Frotas.API.Application.Services.Base.LocalizacaoService.Filters;
using Frotas.API.Application.Services.Base.LocalizacaoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.LocalizacaoService
{
  public class LocalizacaoService(IRepositoryAsync repository, IMapper mapper) : ILocalizacaoService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<LocalizacaoDTO>>> GetLocalizacoesAsync(string keyword = "")
    {
      LocalizacaoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<LocalizacaoDTO> list = await _repository.GetListAsync<
        Localizacao,
        LocalizacaoDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<LocalizacaoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<LocalizacaoDTO>> GetLocalizacoesPaginatedAsync(
      LocalizacaoTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      LocalizacaoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<LocalizacaoDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Localizacao,
        LocalizacaoDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Localizacao by Id
    public async Task<Response<LocalizacaoDTO>> GetLocalizacaoAsync(Guid id)
    {
      try
      {
        LocalizacaoDTO dto = await _repository.GetByIdAsync<Localizacao, LocalizacaoDTO, Guid>(id);
        return Response<LocalizacaoDTO>.Success(dto);
      } 
      catch (Exception ex)
      {
        return Response<LocalizacaoDTO>.Fail(ex.Message);
      }
    }

    // create new Localizacao
    public async Task<Response<Guid>> CreateLocalizacaoAsync(CreateLocalizacaoRequest request)
    {
      LocalizacaoMatchName specification = new(request.Designacao); // ardalis specification
      bool LocalizacaoExists = await _repository.ExistsAsync<Localizacao, Guid>(specification);
      if (LocalizacaoExists)
      {
        return Response<Guid>.Fail("Já existe uma localização com a designação especificada");
      }

      Localizacao newLocalizacao = _mapper.Map(request, new Localizacao()); // map dto to domain entity

      try
      {
        Localizacao response = await _repository.CreateAsync<Localizacao, Guid>(newLocalizacao); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Delegacao
    public async Task<Response<Guid>> UpdateLocalizacaoAsync(UpdateLocalizacaoRequest request, Guid id)
    {
      Localizacao LocalizacaoInDb = await _repository.GetByIdAsync<Localizacao, Guid>(id); // get existing entity
      if (LocalizacaoInDb == null)
      {
        return Response<Guid>.Fail("Localizacao não encontrada");
      }

      Localizacao updatedLocalizacao = _mapper.Map(request, LocalizacaoInDb); // map dto to domain entity

      try
      {
        Localizacao response = await _repository.UpdateAsync<Localizacao, Guid>(updatedLocalizacao); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Localizacao
    public async Task<Response<Guid>> DeleteLocalizacaoAsync(Guid id)
    {
      try
      {
        Localizacao? Localizacao = await _repository.RemoveByIdAsync<Localizacao, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Localizacao.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Localizacoes
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleLocalizacoesAsync(
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
            Localizacao? entity = await _repository.GetByIdAsync<Localizacao, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Localizacao com ID {id}");
              continue;
            }

            // Try to delete the entity
            Localizacao? deletedEntity = await _repository.RemoveByIdAsync<Localizacao, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Localizacao com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Localizacao com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} localizações.";
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
