using AutoMapper;
using Frotas.API.Application.Common;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.FseService.DTOs;
using Frotas.API.Application.Services.Base.FseService.Filters;
using Frotas.API.Application.Services.Base.FseService.Specifications;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Base.FseService
{
    public class FseService : IFseService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public FseService(IRepositoryAsync repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // get full List
        public async Task<Response<IEnumerable<FseDTO>>> GetFsesAsync(string keyword = "")
        {
            FseSearchList specification = new(keyword); // ardalis specification
            IEnumerable<FseDTO> list = await _repository.GetListAsync<Fse, FseDTO, Guid>(specification); // full list, entity mapped to dto
            return Response<IEnumerable<FseDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<FseDTO>> GetFsesPaginatedAsync(FseTableFilter filter)
        {
            string dynamicOrder = (filter.Sorting != null) ? GSHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable
            FseSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification
            PaginatedResponse<FseDTO> pagedResponse = await _repository.GetPaginatedResultsAsync<Fse, FseDTO, Guid>(filter.PageNumber, filter.PageSize, specification); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Fse by Id
        public async Task<Response<FseDTO>> GetFseAsync(Guid id)
        {
            try
            {
                FseDTO dto = await _repository.GetByIdAsync<Fse, FseDTO, Guid>(id);
                return Response<FseDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<FseDTO>.Fail(ex.Message);
            }
        }

        // create new Fse
        public async Task<Response<Guid>> CreateFseAsync(CreateFseRequest request)
        {
            FseMatchName specification = new(request.Nome); // ardalis specification
            bool FseExists = await _repository.ExistsAsync<Fse, Guid>(specification);
            if (FseExists)
            {
                return Response<Guid>.Fail("Fse já existe");
            }

            Fse newFse = _mapper.Map(request, new Fse { Nome = request.Nome }); // map dto to domain entity

            try
            {
                Fse response = await _repository.CreateAsync<Fse, Guid>(newFse); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Fse
        public async Task<Response<Guid>> UpdateFseAsync(UpdateFseRequest request, Guid id)
        {
            Fse FseInDb = await _repository.GetByIdAsync<Fse, Guid>(id); // get existing entity
            if (FseInDb == null)
            {
                return Response<Guid>.Fail("Não encontrado");
            }

            Fse updatedFse = _mapper.Map(request, FseInDb); // map dto to domain entity

            try
            {
                Fse response = await _repository.UpdateAsync<Fse, Guid>(updatedFse); // update entity
                _ = await _repository.SaveChangesAsync();
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Fse
        public async Task<Response<Guid>> DeleteFseAsync(Guid id)
        {
            try
            {
                Fse? Fse = await _repository.RemoveByIdAsync<Fse, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(Fse.Id);
            }
            catch ( Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete multiple Fses
        public async Task<Response<IEnumerable<Guid>>>
        DeleteMultipleFsesAsync(IEnumerable<Guid> ids)
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
                        Fse? entity = await _repository.GetByIdAsync<Fse, Guid>(id);
                        if ( entity == null )
                        {
                            failedDeletions.Add($"Fse com ID {id}");
                            continue;
                        }

                        // Try to delete the entity
                        Fse? deletedEntity = await _repository.RemoveByIdAsync<Fse, Guid>(id);
                        if ( deletedEntity != null )
                        {
                            _ = await _repository.SaveChangesAsync();
                            successfullyDeletedIds.Add(id);
                        }
                        else
                        {
                            failedDeletions.Add($"Fse com ID {id}");
                        }
                    }
                    catch ( Exception ex )
                    {
                        failedDeletions.Add($"Fse com ID {id}");
                        _repository.ClearChangeTracker();
                    }
                }

                // Determine response type based on results
                if ( successfullyDeletedIds.Count == idsList.Count )
                {
                    // All deletions successful
                    return Response<IEnumerable<Guid>>.Success(successfullyDeletedIds);
                }
                else if ( successfullyDeletedIds.Count > 0 )
                {
                    // Partial success - some deletions succeeded, some failed
                    string message = $"Eliminadas com sucesso {successfullyDeletedIds.Count} de {idsList.Count} fses.";
                    return Response<IEnumerable<Guid>>.PartialSuccess(successfullyDeletedIds, message);
                }
                else
                {
                    // All deletions failed
                    return Response<IEnumerable<Guid>>.Fail(string.Join("; ", failedDeletions));
                }
            }
            catch ( Exception ex )
            {
                return Response<IEnumerable<Guid>>.Fail(ex.Message);
            }
        }
    }
}