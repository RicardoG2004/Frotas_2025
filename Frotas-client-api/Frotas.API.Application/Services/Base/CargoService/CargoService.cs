using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.CargoService.DTOs;
using Frotas.API.Application.Services.Base.CargoService.Filters;
using Frotas.API.Application.Services.Base.CargoService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.CargoService
{
  public class CargoService : ICargoService
  {
    private readonly IRepositoryAsync _repository;
    private readonly IMapper _mapper;

    public CargoService(IRepositoryAsync repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    // get full List
    public async Task<Response<IEnumerable<CargoDTO>>> GetCargosAsync(string keyword = "")
    {
      CargoSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CargoDTO> list = await _repository.GetListAsync<Cargo, CargoDTO, Guid>(
        specification
      ); // full list, entity mapped to dto
      return Response<IEnumerable<CargoDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CargoDTO>> GetCargosPaginatedAsync(
      CargoTableFilter filter
    )
    {
      string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CargoSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CargoDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Cargo,
        CargoDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Cargo by Id
    public async Task<Response<CargoDTO>> GetCargoAsync(Guid id)
    {
      try
      {
        CargoDTO dto = await _repository.GetByIdAsync<Cargo, CargoDTO, Guid>(id);
        return Response<CargoDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CargoDTO>.Fail(ex.Message);
      }
    }

    // create new Cargo
    public async Task<Response<Guid>> CreateCargoAsync(CreateCargoRequest request)
    {
      CargoMatchName specification = new(request.Designacao); // ardalis specification
      bool CargoExists = await _repository.ExistsAsync<Cargo, Guid>(specification);
      if (CargoExists)
      {
        return Response<Guid>.Fail("Cargo já existe");
      }

      Cargo newCargo = _mapper.Map(request, new Cargo { Designacao = request.Designacao }); // map dto to domain entity

      try
      {
        Cargo response = await _repository.CreateAsync<Cargo, Guid>(newCargo); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Fornecedor
    public async Task<Response<Guid>> UpdateCargoAsync(UpdateCargoRequest request, Guid id)
    {
      Cargo CargoInDb = await _repository.GetByIdAsync<Cargo, Guid>(id); // get existing entity
      if (CargoInDb == null)
      {
        return Response<Guid>.Fail("Não encontrado");
      }

      Cargo updatedCargo = _mapper.Map(request, CargoInDb); // map dto to domain entity

      try
      {
        Cargo response = await _repository.UpdateAsync<Cargo, Guid>(updatedCargo); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Fornecedor
    public async Task<Response<Guid>> DeleteCargoAsync(Guid id)
    {
      try
      {
        Cargo? Cargo = await _repository.RemoveByIdAsync<Cargo, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Cargo.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Fornecedores
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCargosAsync(
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
            Cargo? entity = await _repository.GetByIdAsync<Cargo, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Cargo com ID {id}");
              continue;
            }

            // Try to delete the entity
            Cargo? deletedEntity = await _repository.RemoveByIdAsync<Cargo, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Cargo com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Cargo com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} cargos.";
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


