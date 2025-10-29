using AutoMapper;
using GSLP.Application.Common;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Platform.ClienteService.DTOs;
using GSLP.Application.Services.Platform.ClienteService.Filters;
using GSLP.Application.Services.Platform.ClienteService.Specifications;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;

// After creating this service:
// -- 1. Create a Cliente domain entity in GSLP.Domain/Entities/Catalog
// -- 2. Add DbSet<Cliente> to GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContext and create a new migration
// -- 3. Add mapping configuration for the new DTOs in GSLP.Infrastructure/Mapper/MappingProfiles
// -- 4. Create a Clientes api controller, you can use the command: dotnet new nano-controller -s (single name) -p (plural name) -ap (app name) -ui (spa/razor)
namespace GSLP.Application.Services.Platform.ClienteService
{
    public class ClienteService : BaseService, IClienteService
    {
        private readonly IRepositoryAsync _repository;
        private readonly IMapper _mapper;

        public ClienteService(IRepositoryAsync repository, IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        #region [-- CLIENTE - API METHODS --]

        // get full List
        public async Task<Response<IEnumerable<ClienteDTO>>> GetClientesResponseAsync(
            string keyword = ""
        )
        {
            ClienteSearchList specification = new(keyword); // ardalis specification
            IEnumerable<ClienteDTO> list = await _repository.GetListAsync<
                Cliente,
                ClienteDTO,
                Guid
            >(specification); // full list, entity mapped to dto
            return Response<IEnumerable<ClienteDTO>>.Success(list);
        }

        // get Tanstack Table paginated list (as seen in the React and Vue project tables)
        public async Task<PaginatedResponse<ClienteDTO>> GetClientesPaginatedResponseAsync(
            ClienteTableFilter filter
        )
        {
            string dynamicOrder =
                (filter.Sorting != null) ? GSLPHelpers.GenerateOrderByString(filter) : ""; // possible dynamic ordering from datatable

            ClienteSearchTable specification = new(filter.Filters ?? [], dynamicOrder); // ardalis specification

            PaginatedResponse<ClienteDTO> pagedResponse =
                await _repository.GetPaginatedResultsAsync<Cliente, ClienteDTO, Guid>(
                    filter.PageNumber,
                    filter.PageSize,
                    specification
                ); // paginated response, entity mapped to dto
            return pagedResponse;
        }

        // get single Cliente by Id
        public async Task<Response<ClienteDTO>> GetClienteResponseAsync(Guid id)
        {
            try
            {
                ClienteDTO dto = await _repository.GetByIdAsync<Cliente, ClienteDTO, Guid>(id);
                if (dto == null)
                {
                    return Response<ClienteDTO>.Fail("Cliente não encontrado");
                }
                return Response<ClienteDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return Response<ClienteDTO>.Fail(ex.Message);
            }
        }

        // create new Cliente
        public async Task<Response<Guid>> CreateClienteResponseAsync(CreateClienteRequest request)
        {
            ClienteMatchNIF clienteMatchNIF = new(request.NIF); // ardalis specification
            bool ClienteExists = await _repository.ExistsAsync<Cliente, Guid>(clienteMatchNIF);
            if (ClienteExists)
            {
                return Response<Guid>.Fail("Já existe um cliente com o nif fornecido");
            }

            Cliente newCliente = _mapper.Map(request, new Cliente()); // map dto to domain entity

            try
            {
                Cliente response = await _repository.CreateAsync<Cliente, Guid>(newCliente); // create new entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // update Cliente
        public async Task<Response<Guid>> UpdateClienteResponseAsync(
            UpdateClienteRequest request,
            Guid id
        )
        {
            Cliente ClienteInDb = await _repository.GetByIdAsync<Cliente, Guid>(id); // get existing entity
            if (ClienteInDb == null)
            {
                return Response<Guid>.Fail("Not Found");
            }

            Cliente updatedCliente = _mapper.Map(request, ClienteInDb); // map dto to domain entity

            try
            {
                Cliente response = await _repository.UpdateAsync<Cliente, Guid>(updatedCliente); // update entity
                _ = await _repository.SaveChangesAsync(); // save changes to db
                return Response<Guid>.Success(response.Id); // return id
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        // delete Cliente
        public async Task<Response<Guid>> DeleteClienteResponseAsync(Guid id)
        {
            try
            {
                ClienteAddAllIncludes specification = new();
                Cliente cliente = await _repository.GetByIdAsync(id, specification);

                if (cliente == null)
                {
                    return Response<Guid>.Fail("Cliente não encontrado");
                }

                if (cliente.Licencas.Count > 0)
                {
                    return Response<Guid>.Fail("Cliente possui licenças associadas");
                }

                // Remove PerfilFuncionalidade relations
                await _repository.DeleteWhereAsync<ApplicationUser>(u => u.ClienteId == id);

                Cliente? removedCliente = await _repository.RemoveByIdAsync<Cliente, Guid>(id);
                _ = await _repository.SaveChangesAsync();

                return Response<Guid>.Success(removedCliente.Id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }

        public async Task<Response<List<Guid>>> DeleteClientesAsync(List<Guid> ids)
        {
            List<Guid> successfullyDeleted = [];
            List<string> failureMessages = [];

            try
            {
                foreach (Guid id in ids)
                {
                    try
                    {
                        ClienteAddAllIncludes specification = new();
                        Cliente cliente = await _repository.GetByIdAsync(id, specification);

                        if (cliente == null)
                        {
                            failureMessages.Add($"Cliente {id} não encontrado");
                            continue;
                        }

                        if (cliente.Licencas.Count > 0)
                        {
                            failureMessages.Add($"Cliente {id} possui licenças associadas");
                            continue;
                        }

                        // Remove ApplicationUser relations
                        await _repository.DeleteWhereAsync<ApplicationUser>(u => u.ClienteId == id);

                        // Remove the cliente
                        Cliente? removedCliente = await _repository.RemoveByIdAsync<Cliente, Guid>(
                            id
                        );
                        if (removedCliente != null)
                        {
                            successfullyDeleted.Add(removedCliente.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        failureMessages.Add($"Erro ao processar cliente {id}: {ex.Message}");
                    }
                }

                _ = await _repository.SaveChangesAsync();

                return failureMessages.Count > 0
                    ? Response<List<Guid>>.Fail(failureMessages)
                    : Response<List<Guid>>.Success(successfullyDeleted);
            }
            catch (Exception ex)
            {
                return Response<List<Guid>>.Fail(ex.Message);
            }
        }

        public async Task<Response<ClienteDTO>> GetClienteByLicencaResponseAsync(Guid licencaId)
        {
            // Use the specification to find Cliente by Licenca
            ClienteMatchLicencaId clienteMatchLicencaId = new(licencaId); // Specification filters based on Licenca association

            // Pass the specification to the repository method
            ClienteDTO cliente = await _repository.FirstOrDefaultAsync<Cliente, ClienteDTO, Guid>(
                clienteMatchLicencaId
            );

            if (cliente == null)
            {
                return Response<ClienteDTO>.Fail(
                    "Cliente não encontrado para a Licença fornecida."
                );
            }

            return Response<ClienteDTO>.Success(cliente);
        }

        #endregion [-- CLIENTE - API METHODS --]
    }
}
