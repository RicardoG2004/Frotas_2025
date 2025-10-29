using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.Filters;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

// After creating this service:
// -- 1. Create a Sepultura domain entity in GACloud.API.Domain/Entities/Catalog
// -- 2. Add DbSet<Sepultura> to GACloud.API.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GACloud.API.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Sepulturas api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GACloud.API.Application.Services.Cemiterios.SepulturaService
{
  public class SepulturaService(IRepositoryAsync repository, IMapper mapper) : ISepulturaService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<Response<IEnumerable<SepulturaDTO>>> GetSepulturasAsync(string keyword = "")
    {
      SepulturaSearchList specification = new(keyword); // ardalis specification
      IEnumerable<SepulturaDTO> list = await _repository.GetListAsync<
        Sepultura,
        SepulturaDTO,
        Guid
      >(specification); // full list, entity mapped to dto
      return Response<IEnumerable<SepulturaDTO>>.Success(list);
    }

    // get Tanstack Table paginated list (as seen in the React and Vue project tables)
    public async Task<PaginatedResponse<SepulturaDTO>> GetSepulturasPaginatedAsync(
      SepulturaTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
      SepulturaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
      PaginatedResponse<SepulturaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
        Sepultura,
        SepulturaDTO,
        Guid
      >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
      return pagedResponse;
    }

    // get single Sepultura by Id
    public async Task<Response<SepulturaDTO>> GetSepulturaAsync(Guid id)
    {
      Console.WriteLine("************START");
      try
      {
        SepulturaDTO dto = await _repository.GetByIdAsync<Sepultura, SepulturaDTO, Guid>(id);

        // Get proprietarios for this sepultura
        var proprietariosSpecification = new ProprietarioSepulturaBySepulturaId(id);
        var proprietarios = await _repository.GetListAsync<
          ProprietarioSepultura,
          ProprietarioSepulturaDTO,
          Guid
        >(proprietariosSpecification);
        dto.Proprietarios = proprietarios.ToList();

        Console.WriteLine("**************END");
        return Response<SepulturaDTO>.Success(dto);
      }
      catch (Exception ex)
      {
        Console.WriteLine("**************END");
        return Response<SepulturaDTO>.Fail(ex.Message);
      }
    }

    // create new Sepultura
    public async Task<Response<Guid>> CreateSepulturaAsync(CreateSepulturaRequest request)
    {
      SepulturaMatchName specification = new(request.Nome); // ardalis specification
      bool SepulturaExists = await _repository.ExistsAsync<Sepultura, Guid>(specification);
      if (SepulturaExists)
      {
        return Response<Guid>.Fail("Sepultura already exists");
      }

      Sepultura newSepultura = _mapper.Map(request, new Sepultura()); // map dto to domain entity

      try
      {
        Sepultura response = await _repository.CreateAsync<Sepultura, Guid>(newSepultura); // create new entity

        // Handle proprietarios if provided
        if (request.Proprietarios != null && request.Proprietarios.Any())
        {
          foreach (var proprietarioRequest in request.Proprietarios)
          {
            Guid ProprietarioId;

            if (proprietarioRequest.ProprietarioId.HasValue)
            {
              // Use existing proprietario
              ProprietarioId = proprietarioRequest.ProprietarioId.Value;
            }
            else
            {
              // Create new proprietario first
              var newIsProprietario = new Proprietario
              {
                CemiterioId = proprietarioRequest.CemiterioId.Value,
                EntidadeId = proprietarioRequest.EntidadeId.Value,
              };

              var createdIsProprietario = await _repository.CreateAsync<Proprietario, Guid>(
                newIsProprietario
              );
              ProprietarioId = createdIsProprietario.Id;
            }

            // Create the relationship
            var sepultura = new ProprietarioSepultura
            {
              ProprietarioId = ProprietarioId,
              SepulturaId = response.Id,
              Data = proprietarioRequest.Data,
              Ativo = proprietarioRequest.Ativo,
              IsProprietario = proprietarioRequest.IsProprietario,
              IsResponsavel = proprietarioRequest.IsResponsavel,
              IsResponsavelGuiaReceita = proprietarioRequest.IsResponsavelGuiaReceita,
              DataInativacao = proprietarioRequest.DataInativacao,
              Fracao = proprietarioRequest.Fracao,
              Historico = proprietarioRequest.Historico,
              Observacoes = proprietarioRequest.Observacoes,
            };

            await _repository.CreateAsync<ProprietarioSepultura, Guid>(sepultura);
          }
        }

        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Sepultura
    public async Task<Response<Guid>> UpdateSepulturaAsync(UpdateSepulturaRequest request, Guid id)
    {
      Sepultura SepulturaInDb = await _repository.GetByIdAsync<Sepultura, Guid>(id); // get existing entity
      if (SepulturaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      _mapper.Map(request, SepulturaInDb); // map dto to domain entity

      try
      {
        Sepultura response;
        bool hasSepulturaChanges = false;

        // Try to update the entity, but don't fail if there are no changes
        try
        {
          response = await _repository.UpdateAsync<Sepultura, Guid>(SepulturaInDb);
          hasSepulturaChanges = true;
        }
        catch (Exception ex) when (ex.Message.Contains("Nada a ser atualizado"))
        {
          // If no changes to main entity, use the existing entity
          response = SepulturaInDb;
        }

        // Track if any proprietarios have changes
        bool hasProprietariosChanges = false;

        // Handle proprietarios if provided
        if (request.Proprietarios != null)
        {
          // Get existing proprietarios
          var existingProprietariosSpecification = new ProprietarioSepulturaBySepulturaId(id);
          var existingProprietarios = await _repository.GetListAsync<ProprietarioSepultura, Guid>(
            existingProprietariosSpecification
          );

          // Remove proprietarios that are no longer in the request
          var proprietariosToRemove = existingProprietarios
            .Where(ep => !request.Proprietarios.Any(rp => rp.Id == ep.Id))
            .ToList();

          if (proprietariosToRemove.Count > 0)
          {
            hasProprietariosChanges = true;
          }

          foreach (var proprietarioToRemove in proprietariosToRemove)
          {
            await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(proprietarioToRemove.Id);
          }

          // Update or create proprietarios
          foreach (var proprietarioRequest in request.Proprietarios)
          {
            if (proprietarioRequest.Id.HasValue)
            {
              // Update existing proprietario
              var existingIsProprietario = existingProprietarios.FirstOrDefault(ep =>
                ep.Id == proprietarioRequest.Id.Value
              );
              if (existingIsProprietario != null)
              {
                // Check if there are any changes to the proprietario relationship
                bool hasIsProprietarioChanges =
                  existingIsProprietario.Data != proprietarioRequest.Data
                  || existingIsProprietario.Ativo != proprietarioRequest.Ativo
                  || existingIsProprietario.IsProprietario != proprietarioRequest.IsProprietario
                  || existingIsProprietario.IsResponsavel != proprietarioRequest.IsResponsavel
                  || existingIsProprietario.IsResponsavelGuiaReceita
                    != proprietarioRequest.IsResponsavelGuiaReceita
                  || existingIsProprietario.DataInativacao != proprietarioRequest.DataInativacao
                  || existingIsProprietario.Fracao != proprietarioRequest.Fracao
                  || existingIsProprietario.Historico != proprietarioRequest.Historico
                  || existingIsProprietario.Observacoes != proprietarioRequest.Observacoes;

                if (hasIsProprietarioChanges)
                {
                  hasProprietariosChanges = true;

                  existingIsProprietario.Data = proprietarioRequest.Data;
                  existingIsProprietario.Ativo = proprietarioRequest.Ativo;
                  existingIsProprietario.IsProprietario = proprietarioRequest.IsProprietario;
                  existingIsProprietario.IsResponsavel = proprietarioRequest.IsResponsavel;
                  existingIsProprietario.IsResponsavelGuiaReceita =
                    proprietarioRequest.IsResponsavelGuiaReceita;
                  existingIsProprietario.DataInativacao = proprietarioRequest.DataInativacao;
                  existingIsProprietario.Fracao = proprietarioRequest.Fracao;
                  existingIsProprietario.Historico = proprietarioRequest.Historico;
                  existingIsProprietario.Observacoes = proprietarioRequest.Observacoes;

                  await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                    existingIsProprietario
                  );
                }
                // If no changes, skip the update
              }
            }
            else
            {
              // Create new proprietario relationship
              hasProprietariosChanges = true;
              // First, we need to get or create the Proprietario
              Guid ProprietarioId;

              if (proprietarioRequest.ProprietarioId.HasValue)
              {
                // Use existing proprietario
                ProprietarioId = proprietarioRequest.ProprietarioId.Value;
              }
              else
              {
                // Create new proprietario first
                var newIsProprietario = new Proprietario
                {
                  CemiterioId = proprietarioRequest.CemiterioId.Value,
                  EntidadeId = proprietarioRequest.EntidadeId.Value,
                };

                var createdIsProprietario = await _repository.CreateAsync<Proprietario, Guid>(
                  newIsProprietario
                );
                ProprietarioId = createdIsProprietario.Id;
              }

              // Create the relationship
              var newIsProprietarioSepultura = new ProprietarioSepultura
              {
                ProprietarioId = ProprietarioId,
                SepulturaId = id,
                Data = proprietarioRequest.Data,
                Ativo = proprietarioRequest.Ativo,
                IsProprietario = proprietarioRequest.IsProprietario,
                IsResponsavel = proprietarioRequest.IsResponsavel,
                IsResponsavelGuiaReceita = proprietarioRequest.IsResponsavelGuiaReceita,
                DataInativacao = proprietarioRequest.DataInativacao,
                Fracao = proprietarioRequest.Fracao,
                Historico = proprietarioRequest.Historico,
                Observacoes = proprietarioRequest.Observacoes,
              };

              await _repository.CreateAsync<ProprietarioSepultura, Guid>(
                newIsProprietarioSepultura
              );
            }
          }
        }

        // Check if any changes were made
        if (!hasSepulturaChanges && !hasProprietariosChanges)
        {
          return Response<Guid>.Fail("Nada para atualizar");
        }

        _ = await _repository.SaveChangesAsync(); // save changes to db
        return Response<Guid>.Success(response.Id); // return id
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Sepultura
    public async Task<Response<Guid>> DeleteSepulturaAsync(Guid id)
    {
      try
      {
        // Delete related proprietario sepulturas first
        var proprietariosSpecification = new ProprietarioSepulturaBySepulturaId(id);
        var proprietarioSepulturas = await _repository.GetListAsync<ProprietarioSepultura, Guid>(
          proprietariosSpecification
        );
        foreach (var proprietarioSepultura in proprietarioSepulturas)
        {
          await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(proprietarioSepultura.Id);
        }

        Sepultura? Sepultura = await _repository.RemoveByIdAsync<Sepultura, Guid>(id);
        _ = await _repository.SaveChangesAsync();

        return Response<Guid>.Success(Sepultura.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    public async Task<Response<Guid>> UpdateSepulturaSvgAsync(
      UpdateSepulturaSvgRequest request,
      Guid id
    )
    {
      Sepultura SepulturaInDb = await _repository.GetByIdAsync<Sepultura, Guid>(id);
      if (SepulturaInDb == null)
      {
        return Response<Guid>.Fail("Not Found");
      }

      SepulturaInDb.TemSvgShape = request.TemSvgShape;
      SepulturaInDb.ShapeId = request.ShapeId;

      try
      {
        Sepultura response = await _repository.UpdateAsync<Sepultura, Guid>(SepulturaInDb);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Sepulturas
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleSepulturasAsync(
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
            Sepultura? entity = await _repository.GetByIdAsync<Sepultura, Guid>(id);
            if (entity == null)
            {
              failedDeletions.Add($"Sepultura com ID {id}");
              continue;
            }

            // Delete related proprietario sepulturas first
            var proprietariosSpecification = new ProprietarioSepulturaBySepulturaId(id);
            var proprietarioSepulturas = await _repository.GetListAsync<
              ProprietarioSepultura,
              Guid
            >(proprietariosSpecification);
            foreach (var proprietarioSepultura in proprietarioSepulturas)
            {
              await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(
                proprietarioSepultura.Id
              );
            }

            // Try to delete the entity
            Sepultura? deletedEntity = await _repository.RemoveByIdAsync<Sepultura, Guid>(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Sepultura com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Sepultura com ID {id}");

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
            $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} sepulturas.";
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
