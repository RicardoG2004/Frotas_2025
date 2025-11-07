using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.GarantiaService.DTOs;
using Frotas.API.Application.Services.Base.GarantiaService.Filters;
using Frotas.API.Application.Services.Base.GarantiaService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.GarantiaService
{
    public class GarantiaService(IRepositoryAsync repository, IMapper mapper) : IGarantiaService
    {
        private readonly IRepositoryAsync _repository = repository;
        private readonly IMapper _mapper = mapper;

        // get full List
        public async Task<Response<IEnumerable<GarantiaDTO>>> GetGarantiasAsync(string keyword = "")
        {
            GarantiaSearchList specification = new(keyword); // ardalis specification
            IEnumerable<GarantiaDTO> list = await _repository.GetListAsync<Garantia, GarantiaDTO, Guid>(
                specification
            ); // full list, entity mapped to dto
            return Response<IEnumerable<GarantiaDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<GarantiaDTO>> GetGarantiasPaginatedAsync(
            GarantiaTableFilter filter
        )
        {
            string dynamicOrder =
                filter.Sorting != null ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
            GarantiaSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
            PaginatedResponse<GarantiaDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<
                Garantia,
                GarantiaDTO,
                Guid
            >(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Garantia by Id
        public async Task<Response<GarantiaDTO>> GetGarantiaAsync(Guid id)
        {
            try
            {
                GarantiaDTO dto = await _repository.GetByIdAsync<Garantia, GarantiaDTO, Guid>(id);
                return Response<GarantiaDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<GarantiaDTO>.Fail(ex.Message);
            }
        }

        // create new Garantia
        public async Task<Response<Guid>> CreateGarantiaAsync(CreateGarantiaRequest request)
        {
            GarantiaMatchName specification = new(request.Designacao); // ardalis specification
            bool GarantiaExists = await _repository.ExistsAsync<Garantia, Guid>(specification);
            if (GarantiaExists)
            {
                return Response<Guid>.Fail("Já existe uma garantia com a designação especificada");
            }

            Garantia newGarantia = _mapper.Map(request, new Garantia()); // map dto to domain entity

            try
            {
                Garantia response = await _repository.CreateAsync<Garantia, Guid>(newGarantia); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Garantia
        public async Task<Response<Guid>> UpdateGarantiaAsync(UpdateGarantiaRequest request, Guid id)
        {
            Garantia GarantiaInDb = await _repository.GetByIdAsync<Garantia, Guid>(id); // get existing entity
            if (GarantiaInDb == null)
            {
                return Response<Guid>.Fail("Garantia não encontrada");
            }

            Garantia updatedGarantia = _mapper.Map(request, GarantiaInDb); // map dto to domain entity

            try
            {
                Garantia response = await _repository.UpdateAsync<Garantia, Guid>(updatedGarantia); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Garantia
        public async Task<Response<Guid>> DeleteGarantiaAsync(Guid id)
        {
            try
            {
                Garantia? Garantia = await _repository.RemoveByIdAsync<Garantia, Guid>(id);
                if (Garantia == null)
                {
                    return Response<Guid>.Fail("Garantia não encontrada");
                }

                _ = await _repository.SaveChangesAsync();
                return Response<Guid>.Success(Garantia.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete multiple Garantias
        public async Task<Response<IEnumerable<Guid>>> DeleteMultipleGarantiasAsync(
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
                        Garantia? entity = await _repository.GetByIdAsync<Garantia, Guid>(id);
                        if (entity == null)
                        {
                            failedDeletions.Add($"Garantia com ID {id}");
                            continue;
                        }

                        // Try to delete the entity
                        Garantia? deletedEntity = await _repository.RemoveByIdAsync<Garantia, Guid>(id);
                        if (deletedEntity != null)
                        {
                            // Save changes immediately for this entity to avoid transaction rollback
                            // This will throw an exception if there are foreign key constraints
                            _ = await _repository.SaveChangesAsync();
                            successfullyDeletedIds.Add(id);
                        }
                        else
                        {
                            failedDeletions.Add($"Garantia com ID {id}");
                        }
                    }
                    catch (Exception)
                    {
                        // Just count the failure, no need for detailed error messages
                        failedDeletions.Add($"Garantia com ID {id}");

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
                        $"Eliminados com sucesso {successfullyDeletedIds.Count} de {idsList.Count} garantias.";
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
