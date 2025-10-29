using AutoMapper;
using GACloud.API.Application.Common;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Common.Wrapper;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.Filters;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications;
using GACloud.API.Application.Utility;
using GACloud.API.Domain.Entities.Cemiterios;
using Microsoft.EntityFrameworkCore;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService
{
  public class ProprietarioService(IRepositoryAsync repository, IMapper mapper)
    : IProprietarioService,
      IScopedService
  {
    private readonly IRepositoryAsync _repository = repository;
    private readonly IMapper _mapper = mapper;

    // get full List
    public async Task<
      Response<IEnumerable<ProprietarioDTO>>
    > GetProprietariosAsync(string keyword = "")
    {
      ProprietarioSearchList specification = new(keyword);
      IEnumerable<ProprietarioDTO> list = await _repository.GetListAsync<
        Proprietario,
        ProprietarioDTO,
        Guid
      >(specification);
      return Response<IEnumerable<ProprietarioDTO>>.Success(list);
    }

    // get Proprietarios with pagination
    public async Task<PaginatedResponse<ProprietarioDTO>> GetProprietariosAsync(
      ProprietarioTableFilter filter
    )
    {
      string dynamicOrder = filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : "";
      ProprietarioSearchTable specification = new(filter.Filters ?? [], dynamicOrder);
      PaginatedResponse<ProprietarioDTO> pagedResponse =
        await _repository.GetPaginatedResultsAsync<
          Proprietario,
          ProprietarioDTO,
          Guid
        >(filter.PageNumber, filter.PageSize, specification);
      return pagedResponse;
    }

    // get Proprietario by id
    public async Task<Response<ProprietarioDTO>> GetProprietarioByIdAsync(Guid id)
    {
      try
      {
        var cemiterioIsProprietarioDTO = await _repository.GetByIdAsync<
          Proprietario,
          ProprietarioDTO,
          Guid
        >(id);

        // Get sepulturas for this proprietario
        var sepulturasSpecification = new ProprietarioSepulturaByProprietarioId(id);
        var sepulturas = await _repository.GetListAsync<
          ProprietarioSepultura,
          ProprietarioSepulturaDTO,
          Guid
        >(sepulturasSpecification);
        cemiterioIsProprietarioDTO.Sepulturas = sepulturas.ToList();

        return Response<ProprietarioDTO>.Success(cemiterioIsProprietarioDTO);
      }
      catch (Exception ex)
      {
        return Response<ProprietarioDTO>.Fail(ex.Message);
      }
    }

    // create Proprietario
    public async Task<Response<Guid>> CreateProprietarioAsync(
      CreateProprietarioRequest request
    )
    {
      try
      {
        // Check if EntidadeId is already associated with a proprietario
        var existingIsProprietarios = await _repository.GetListAsync<Proprietario, Guid>(
          new ProprietarioMatchEntidade(request.EntidadeId)
        );
        var existingIsProprietario = existingIsProprietarios.FirstOrDefault();
        if (existingIsProprietario != null)
        {
          return Response<Guid>.Fail("Já existe um proprietário associado a esta entidade.");
        }

        var newProprietario = _mapper.Map<Proprietario>(request);
        var response = await _repository.CreateAsync<Proprietario, Guid>(
          newProprietario
        );

        // Handle sepulturas if provided
        if (request.Sepulturas != null && request.Sepulturas.Any())
        {
          foreach (var sepulturaRequest in request.Sepulturas)
          {
            // Check if this sepultura already has proprietarios
            var existingSepulturasSpecification = new ProprietarioSepulturaBySepulturaId(
              sepulturaRequest.SepulturaId
            );
            var existingSepulturas = await _repository.GetListAsync<
              ProprietarioSepultura,
              Guid
            >(existingSepulturasSpecification);

            // Calculate new fraction based on number of proprietarios
            int totalIsProprietarios = existingSepulturas.Count() + 1; // +1 for the new one
            string newFracao = $"{100 / totalIsProprietarios}%";

            // Update existing proprietarios' fractions
            foreach (var existingSepultura in existingSepulturas)
            {
              // Only update if the fraction actually changed
              if (existingSepultura.Fracao != newFracao)
              {
                existingSepultura.Fracao = newFracao;
                await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                  existingSepultura
                );
              }
            }

            var sepultura = new ProprietarioSepultura
            {
              ProprietarioId = response.Id,
              SepulturaId = sepulturaRequest.SepulturaId,
              Data = sepulturaRequest.Data,
              Ativo = sepulturaRequest.Ativo,
              IsProprietario = sepulturaRequest.IsProprietario,
              IsResponsavel = sepulturaRequest.IsResponsavel,
              IsResponsavelGuiaReceita = sepulturaRequest.IsResponsavelGuiaReceita,
              DataInativacao = sepulturaRequest.DataInativacao,
              Fracao = newFracao, // Use calculated fraction
              Historico = sepulturaRequest.Historico,
              Observacoes = sepulturaRequest.Observacoes,
            };

            await _repository.CreateAsync<ProprietarioSepultura, Guid>(sepultura);
          }
        }

        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // update Proprietario
    public async Task<Response<Guid>> UpdateProprietarioAsync(
      UpdateProprietarioRequest request,
      Guid id
    )
    {
      try
      {
        var cemiterioIsProprietarioInDb = await _repository.GetByIdAsync<
          Proprietario,
          Guid
        >(id);
        if (cemiterioIsProprietarioInDb == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Check if EntidadeId is already associated with another proprietario
        var existingIsProprietarios = await _repository.GetListAsync<Proprietario, Guid>(
          new ProprietarioMatchEntidade(request.EntidadeId)
        );
        var existingIsProprietario = existingIsProprietarios.FirstOrDefault();
        if (existingIsProprietario != null && existingIsProprietario.Id != id)
        {
          return Response<Guid>.Fail("Já existe um proprietário associado a esta entidade.");
        }

        var updatedProprietario = _mapper.Map(request, cemiterioIsProprietarioInDb);

        // Try to update the main entity, but don't fail if there are no changes
        Proprietario response;
        try
        {
          response = await _repository.UpdateAsync<Proprietario, Guid>(
            updatedProprietario
          );
        }
        catch (Exception ex) when (ex.Message.Contains("Nada a ser atualizado"))
        {
          // If no changes to main entity, use the existing entity
          response = cemiterioIsProprietarioInDb;
        }

        // Check if there are any changes to sepulturas
        bool hasSepulturaChanges = false;

        // Get existing sepulturas first
        var existingSepulturasSpecification = new ProprietarioSepulturaByProprietarioId(
          id
        );
        var existingSepulturas = await _repository.GetListAsync<
          ProprietarioSepultura,
          Guid
        >(existingSepulturasSpecification);

        // Determine sepulturas to remove
        List<ProprietarioSepultura> sepulturasToRemove = new();

        if (request.Sepulturas != null)
        {
          // Check if there are sepulturas to remove
          sepulturasToRemove = existingSepulturas
            .Where(es => !request.Sepulturas.Any(rs => rs.Id == es.Id))
            .ToList();
        }
        else
        {
          // If request.Sepulturas is null but there are existing sepulturas, remove all of them
          sepulturasToRemove = existingSepulturas.ToList();
        }

        if (sepulturasToRemove.Any())
        {
          hasSepulturaChanges = true;

          // Group sepulturas to remove by SepulturaId to recalculate fractions
          var sepulturasToRemoveBySepulturaId = sepulturasToRemove
            .GroupBy(s => s.SepulturaId)
            .ToDictionary(g => g.Key, g => g.ToList());

          foreach (var sepulturaToRemove in sepulturasToRemove)
          {
            await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(
              sepulturaToRemove.Id
            );
          }

          // Recalculate fractions for sepulturas that had proprietarios removed
          foreach (var kvp in sepulturasToRemoveBySepulturaId)
          {
            var SepulturaId = kvp.Key;
            var removedCount = kvp.Value.Count;

            // Get remaining proprietarios for this sepultura
            var remainingSepulturasSpecification = new ProprietarioSepulturaBySepulturaId(
              SepulturaId
            );
            var remainingSepulturas = await _repository.GetListAsync<
              ProprietarioSepultura,
              Guid
            >(remainingSepulturasSpecification);

            if (remainingSepulturas.Any())
            {
              // Calculate new fraction based on remaining proprietarios
              int totalRemainingIsProprietarios = remainingSepulturas.Count();
              string newFracao = $"{100 / totalRemainingIsProprietarios}%";

              // Update remaining proprietarios' fractions
              foreach (var remainingSepultura in remainingSepulturas)
              {
                // Only update if the fraction actually changed
                if (remainingSepultura.Fracao != newFracao)
                {
                  remainingSepultura.Fracao = newFracao;
                  await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                    remainingSepultura
                  );
                }
              }

              // Mark that we have changes since we updated other proprietarios' fractions
              hasSepulturaChanges = true;
            }
          }
        }

        // Handle sepulturas if provided
        if (request.Sepulturas != null)
        {
          // Update or create sepulturas
          foreach (var sepulturaRequest in request.Sepulturas)
          {
            if (sepulturaRequest.Id.HasValue)
            {
              // Update existing sepultura
              var existingSepultura = existingSepulturas.FirstOrDefault(es =>
                es.Id == sepulturaRequest.Id.Value
              );
              if (existingSepultura != null)
              {
                // Check if there are any changes to the sepultura
                bool hasIndividualSepulturaChanges =
                  existingSepultura.SepulturaId != sepulturaRequest.SepulturaId
                  || existingSepultura.Data != sepulturaRequest.Data
                  || existingSepultura.Ativo != sepulturaRequest.Ativo
                  || existingSepultura.IsProprietario != sepulturaRequest.IsProprietario
                  || existingSepultura.IsResponsavel != sepulturaRequest.IsResponsavel
                  || existingSepultura.IsResponsavelGuiaReceita
                    != sepulturaRequest.IsResponsavelGuiaReceita
                  || existingSepultura.DataInativacao != sepulturaRequest.DataInativacao
                  || existingSepultura.Fracao != sepulturaRequest.Fracao
                  || existingSepultura.Historico != sepulturaRequest.Historico
                  || existingSepultura.Observacoes != sepulturaRequest.Observacoes;

                if (hasIndividualSepulturaChanges)
                {
                  hasSepulturaChanges = true;
                  existingSepultura.SepulturaId = sepulturaRequest.SepulturaId;
                  existingSepultura.Data = sepulturaRequest.Data;
                  existingSepultura.Ativo = sepulturaRequest.Ativo;
                  existingSepultura.IsProprietario = sepulturaRequest.IsProprietario;
                  existingSepultura.IsResponsavel = sepulturaRequest.IsResponsavel;
                  existingSepultura.IsResponsavelGuiaReceita =
                    sepulturaRequest.IsResponsavelGuiaReceita;
                  existingSepultura.DataInativacao = sepulturaRequest.DataInativacao;
                  existingSepultura.Fracao = sepulturaRequest.Fracao;
                  existingSepultura.Historico = sepulturaRequest.Historico;
                  existingSepultura.Observacoes = sepulturaRequest.Observacoes;

                  await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                    existingSepultura
                  );
                }
              }
            }
            else
            {
              // Create new sepultura
              hasSepulturaChanges = true;

              // Check if this sepultura already has proprietarios
              var existingSepulturasForSepulturaSpecification =
                new ProprietarioSepulturaBySepulturaId(sepulturaRequest.SepulturaId);
              var existingSepulturasForSepultura = await _repository.GetListAsync<
                ProprietarioSepultura,
                Guid
              >(existingSepulturasForSepulturaSpecification);

              // Calculate new fraction based on number of proprietarios
              int totalIsProprietarios = existingSepulturasForSepultura.Count() + 1; // +1 for the new one
              string newFracao = $"{100 / totalIsProprietarios}%";

              // Update existing proprietarios' fractions
              foreach (var existingSepulturaForSepultura in existingSepulturasForSepultura)
              {
                // Only update if the fraction actually changed
                if (existingSepulturaForSepultura.Fracao != newFracao)
                {
                  existingSepulturaForSepultura.Fracao = newFracao;
                  await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                    existingSepulturaForSepultura
                  );
                }
              }

              // Mark that we have changes since we updated other proprietarios' fractions
              hasSepulturaChanges = true;

              var newSepultura = new ProprietarioSepultura
              {
                ProprietarioId = id,
                SepulturaId = sepulturaRequest.SepulturaId,
                Data = sepulturaRequest.Data,
                Ativo = sepulturaRequest.Ativo,
                IsProprietario = sepulturaRequest.IsProprietario,
                IsResponsavel = sepulturaRequest.IsResponsavel,
                IsResponsavelGuiaReceita = sepulturaRequest.IsResponsavelGuiaReceita,
                DataInativacao = sepulturaRequest.DataInativacao,
                Fracao = newFracao, // Use calculated fraction
                Historico = sepulturaRequest.Historico,
                Observacoes = sepulturaRequest.Observacoes,
              };

              await _repository.CreateAsync<ProprietarioSepultura, Guid>(newSepultura);
            }
          }
        }

        // Check if there are any changes to the proprietario entity itself
        bool hasIsProprietarioChanges = response != cemiterioIsProprietarioInDb;

        // Only save changes if there are actual changes
        if (hasIsProprietarioChanges || hasSepulturaChanges)
        {
          _ = await _repository.SaveChangesAsync();
        }

        return Response<Guid>.Success(response.Id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete Proprietario
    public async Task<Response<Guid>> DeleteProprietarioAsync(Guid id)
    {
      try
      {
        var cemiterioIsProprietario = await _repository.GetByIdAsync<Proprietario, Guid>(
          id
        );
        if (cemiterioIsProprietario == null)
        {
          return Response<Guid>.Fail("Not Found");
        }

        // Delete related sepulturas first
        var sepulturasSpecification = new ProprietarioSepulturaByProprietarioId(id);
        var sepulturas = await _repository.GetListAsync<ProprietarioSepultura, Guid>(
          sepulturasSpecification
        );

        // Group sepulturas by SepulturaId to recalculate fractions
        var sepulturasBySepulturaId = sepulturas
          .GroupBy(s => s.SepulturaId)
          .ToDictionary(g => g.Key, g => g.ToList());

        foreach (var sepultura in sepulturas)
        {
          await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(sepultura.Id);
        }

        // Recalculate fractions for sepulturas that had proprietarios removed
        foreach (var kvp in sepulturasBySepulturaId)
        {
          var SepulturaId = kvp.Key;

          // Get remaining proprietarios for this sepultura
          var remainingSepulturasSpecification = new ProprietarioSepulturaBySepulturaId(
            SepulturaId
          );
          var remainingSepulturas = await _repository.GetListAsync<
            ProprietarioSepultura,
            Guid
          >(remainingSepulturasSpecification);

          if (remainingSepulturas.Any())
          {
            // Calculate new fraction based on remaining proprietarios
            int totalRemainingIsProprietarios = remainingSepulturas.Count();
            string newFracao = $"{100 / totalRemainingIsProprietarios}%";

            // Update remaining proprietarios' fractions
            foreach (var remainingSepultura in remainingSepulturas)
            {
              // Only update if the fraction actually changed
              if (remainingSepultura.Fracao != newFracao)
              {
                remainingSepultura.Fracao = newFracao;
                await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                  remainingSepultura
                );
              }
            }
          }
        }

        await _repository.RemoveByIdAsync<Proprietario, Guid>(id);
        _ = await _repository.SaveChangesAsync();
        return Response<Guid>.Success(id);
      }
      catch (Exception ex)
      {
        return Response<Guid>.Fail(ex.Message);
      }
    }

    // delete multiple Proprietarios
    public async Task<Response<IEnumerable<Guid>>> DeleteMultipleProprietariosAsync(
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
            Proprietario? entity = await _repository.GetByIdAsync<
              Proprietario,
              Guid
            >(id);
            if (entity == null)
            {
              failedDeletions.Add($"Proprietário com ID {id}");
              continue;
            }

            // Delete related sepulturas first
            var sepulturasSpecification = new ProprietarioSepulturaByProprietarioId(id);
            var sepulturas = await _repository.GetListAsync<ProprietarioSepultura, Guid>(
              sepulturasSpecification
            );

            // Group sepulturas by SepulturaId to recalculate fractions
            var sepulturasBySepulturaId = sepulturas
              .GroupBy(s => s.SepulturaId)
              .ToDictionary(g => g.Key, g => g.ToList());

            foreach (var sepultura in sepulturas)
            {
              await _repository.RemoveByIdAsync<ProprietarioSepultura, Guid>(sepultura.Id);
            }

            // Recalculate fractions for sepulturas that had proprietarios removed
            foreach (var kvp in sepulturasBySepulturaId)
            {
              var SepulturaId = kvp.Key;

              // Get remaining proprietarios for this sepultura
              var remainingSepulturasSpecification =
                new ProprietarioSepulturaBySepulturaId(SepulturaId);
              var remainingSepulturas = await _repository.GetListAsync<
                ProprietarioSepultura,
                Guid
              >(remainingSepulturasSpecification);

              if (remainingSepulturas.Any())
              {
                // Calculate new fraction based on remaining proprietarios
                int totalRemainingIsProprietarios = remainingSepulturas.Count();
                string newFracao = $"{100 / totalRemainingIsProprietarios}%";

                // Update remaining proprietarios' fractions
                foreach (var remainingSepultura in remainingSepulturas)
                {
                  // Only update if the fraction actually changed
                  if (remainingSepultura.Fracao != newFracao)
                  {
                    remainingSepultura.Fracao = newFracao;
                    await _repository.UpdateAsync<ProprietarioSepultura, Guid>(
                      remainingSepultura
                    );
                  }
                }
              }
            }

            // Try to delete the entity
            Proprietario? deletedEntity = await _repository.RemoveByIdAsync<
              Proprietario,
              Guid
            >(id);
            if (deletedEntity != null)
            {
              // Save changes immediately for this entity to avoid transaction rollback
              // This will throw an exception if there are foreign key constraints
              _ = await _repository.SaveChangesAsync();
              successfullyDeletedIds.Add(id);
            }
            else
            {
              failedDeletions.Add($"Proprietário com ID {id}");
            }
          }
          catch (Exception ex)
          {
            // Just count the failure, no need for detailed error messages
            failedDeletions.Add($"Proprietário com ID {id}");

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
            $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} proprietários.";
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

