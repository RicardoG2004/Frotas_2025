using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Base.FuncionarioService.Filters;
using Frotas.API.Application.Services.Base.FuncionarioService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.FuncionarioService
{
  public class FuncionarioService : IFuncionarioService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public FuncionarioService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<FuncionarioDTO>>> GetFuncionariosAsync(string keyword = "")
    {
      FuncionarioSearchList specification = new(keyword); // ardalis specification
      IEnumerable<FuncionarioDTO> list = await _repository.GetListAsync<Funcionario, FuncionarioDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<FuncionarioDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<FuncionarioDTO>> GetFuncionariosPaginatedAsync(
      FuncionarioTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      FuncionarioSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<FuncionarioDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Funcionario,
        FuncionarioDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Funcionario by Id
    public async Task<Response<FuncionarioDTO>> GetFuncionarioAsync(Guid id)
    {
      try
      {
        FuncionarioDTO dto = await _repository.GetByIdAsync<Funcionario, FuncionarioDTO, Guid>(id);
        return Response<FuncionarioDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<FuncionarioDTO>.Fail(ex.Message);
      }
    }

    // create new Funcionario
    public async Task<Response<Guid>> CreateFuncionarioAsync(CreateFuncionarioRequest request)
    {
      FuncionarioMatchName specification = new(request.Nome); // ardalis specification
      bool FuncionarioExists = await _repository.ExistsAsync<Funcionario, Guid>(specification);
      if (FuncionarioExists)
      {
        return Response<Guid>.Fail("Funcionario já existe");
      }

      Funcionario newFuncionario = _mapper.Map(request, new Funcionario { Nome = request.Nome }); // map dto to domain entity

      try
      {
        Funcionario response = await _repository.CreateAsync<Funcionario, Guid>(newFuncionario); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Funcionario
    public async Task<Response<Guid>> UpdateFuncionarioAsync(UpdateFuncionarioRequest request, Guid id)
    {
      Funcionario FuncionarioInDb = await _repository.GetByIdAsync<Funcionario, Guid>(id); // get existing entity
      if (FuncionarioInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      Funcionario updatedFuncionario = _mapper.Map(request, FuncionarioInDb); // map dto to domain entity

      try
      {
        Funcionario response = await _repository.UpdateAsync<Funcionario, Guid>(updatedFuncionario); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Funcionario
    public async Task<Response<Guid>> DeleteFuncionarioAsync(Guid id)
    {
      try
      {
        Funcionario? Funcionario = await _repository.RemoveByIdAsync<Funcionario, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Funcionario.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Funcionarios
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleFuncionariosAsync(
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
            Funcionario? entity = await _repository.GetByIdAsync<Funcionario, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Funcionario com ID {id}");
              continue;
            }

            // Try to delete the entity
            Funcionario? deletedEntity = await _repository.RemoveByIdAsync<Funcionario, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Funcionario com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Funcionario com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} funcionarios.";
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


