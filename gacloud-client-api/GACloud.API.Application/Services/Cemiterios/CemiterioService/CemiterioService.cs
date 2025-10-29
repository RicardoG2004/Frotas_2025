using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.Filters;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Cemiterio domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Cemiterio> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Cemiterios api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.CemiterioService
{
  public class CemiterioService(
    IRepositoryAsync repository,
    IMapper mapper,
    IWebHostEnvironment environment
  ) : ICemiterioService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly IWebHostEnvironment _environment = environment;

    // get full List
    public async Task<Response<IEnumerable<CemiterioDTO>>> GetCemiteriosAsync(string keyword = "")
    {
      CemiterioSearchList specification = new(keyword); // ardalis specification
      IEnumerable<CemiterioDTO> list = await _repository.GetListAsync<
        Cemiterio,
        CemiterioDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<CemiterioDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<CemiterioDTO>> GetCemiteriosPaginatedAsync(
      CemiterioTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      CemiterioSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<CemiterioDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Cemiterio,
        CemiterioDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Cemiterio by Id
    public async Task<Response<CemiterioDTO>> GetCemiterioAsync(Guid id)
    {
      try
      {
        CemiterioDTO dto = await _repository.GetByIdAsync<Cemiterio, CemiterioDTO, Guid>(id);
        return Response<CemiterioDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        return Response<CemiterioDTO>.Fail(ex.Message);
      }
    }

    private async Task UnsetOtherPredefinidos()
    {
      CemiterioPredefinidoSpec specification = new();
      IEnumerable<Cemiterio> predefinidos = await _repository.GetListAsync<Cemiterio, Guid>(
        specification
      );

      foreach (Cemiterio cemiterio in predefinidos)
      {
        cemiterio.Predefinido = false;
        _ = await _repository.UpdateAsync<Cemiterio, Guid>(cemiterio);
      }
    }

    // create new Cemiterio
    public async Task<Response<Guid>> CreateCemiterioAsync(CreateCemiterioRequest request)
    {
      CemiterioMatchName specification = new(request.Nome); // ardalis specification
      bool CemiterioExists = await _repository.ExistsAsync<Cemiterio, Guid>(specification);
      if (CemiterioExists)
      {
        return Response<Guid>.Fail("Cemiterio already exists");
      }

      Cemiterio newCemiterio = _mapper.Map(request, new Cemiterio()); // map dto to domain entity

      try
      {
        if (request.Predefinido)
        {
          await UnsetOtherPredefinidos();
        }

        Cemiterio response = await _repository.CreateAsync<Cemiterio, Guid>(newCemiterio); // create new entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Cemiterio
    public async Task<Response<Guid>> UpdateCemiterioAsync(UpdateCemiterioRequest request, Guid id)
    {
      Cemiterio CemiterioInDb = await _repository.GetByIdAsync<Cemiterio, Guid>(id); // get existing entity
      if (CemiterioInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      try
      {
        if (request.Predefinido && !CemiterioInDb.Predefinido)
        {
          await UnsetOtherPredefinidos();
        }

        Cemiterio updatedCemiterio = _mapper.Map(request, CemiterioInDb);
        Cemiterio response = await _repository.UpdateAsync<Cemiterio, Guid>(updatedCemiterio); // update entity
        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Cemiterio
    public async Task<Response<Guid>> DeleteCemiterioAsync(Guid id)
    {
      try
      {
        Cemiterio? Cemiterio = await _repository.RemoveByIdAsync<Cemiterio, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Cemiterio.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<string>> UploadCemiterioSvgAsync(UploadCemiterioSvgRequest request)
    {
      try
      {
        string uploadsFolder = Path.Combine(
          _environment.WebRootPath,
          "assets",
          "cemiterios",
          "mapas"
        );

        // Create directory if it doesn't exist
        if (!Directory.Exists(uploadsFolder))
        {
          _ = Directory.CreateDirectory(uploadsFolder);
        }

        string filePath = Path.Combine(uploadsFolder, request.FileName);

        // Delete file if it already exists
        if (File.Exists(filePath))
        {
          File.Delete(filePath);
        }

        // Save the new file
        using (FileStream stream = new(filePath, FileMode.Create))
        {
          await request.SvgFile.CopyToAsync(stream);
        }

        return Response<string>.Success(request.FileName);
      }
      catch (Exception ex)
      {
        return Response<string>.Fail(ex.Message);
      }
    }

    public async Task<Response<CemiterioDTO>> GetCemiterioPredefinidoAsync()
    {
      try
      {
        CemiterioPredefinidoSpec specification = new();
        IEnumerable<CemiterioDTO> list = await _repository.GetListAsync<
          Cemiterio,
          CemiterioDTO,
          Guid
        >(specification);
        CemiterioDTO? cemiterioPredefinido = list.FirstOrDefault();

        if (cemiterioPredefinido == null)
        {
          return Response<CemiterioDTO>.Fail("No predefined Cemiterio found");
        }

        return Response<CemiterioDTO>.Success(cemiterioPredefinido);
      }
      catch (Exception ex)
      {
        return Response<CemiterioDTO>.Fail(ex.Message);
      }
    }

    public async Task<Response<string>> GetCemiterioSvgAsync(Guid id)
    {
      try
      {
        // Get the cemiterio to verify it exists
        var cemiterio = await _repository.GetByIdAsync<Cemiterio, Guid>(id);
        if (cemiterio == null)
        {
          return Response<string>.Fail("Cemiterio not found");
        }

        // Construct the path to the SVG file using the same path as upload
        var svgPath = Path.Combine(
          _environment.WebRootPath,
          "assets",
          "cemiterios",
          "mapas",
          $"{id}.svg"
        );

        // Check if the file exists
        if (!System.IO.File.Exists(svgPath))
        {
          return Response<string>.Fail("SVG file not found for this cemiterio");
        }

        // Read the SVG content
        var svgContent = await System.IO.File.ReadAllTextAsync(svgPath);
        return Response<string>.Success(svgContent);
      }
      catch (Exception ex)
      {
        return Response<string>.Fail($"Error retrieving SVG: {ex.Message}");
      }
    }

    // delete multiple Cemiterios
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleCemiteriosAsync(
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
            Cemiterio? entity = await _repository.GetByIdAsync<Cemiterio, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Cemitério com ID {id}");
              continue;
            }

            // Try to delete the entity
            Cemiterio? deletedEntity = await _repository.RemoveByIdAsync<Cemiterio, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Cemitério com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Cemitério com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} cemitérios.";
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

