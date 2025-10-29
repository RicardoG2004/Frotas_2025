using GSLP.Application.Common;
using GSLP.Application.Services.Application.FuncionalidadeService.Specifications;
using GSLP.Application.Services.Application.ModuloService.Specifications;
using GSLP.Application.Services.Platform.ClienteService.Specifications;
using GSLP.Application.Services.Platform.LicencaService.Specifications;
using GSLP.Application.Services.Platform.PerfilService.Specifications;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services
{
    public class BaseService
    {
        protected readonly IRepositoryAsync _repository;

        public BaseService(IRepositoryAsync repository)
        {
            _repository = repository;
        }

        // Centralized method for getting Cliente
        protected async Task<Cliente> GetClienteByIdAsync(Guid clienteId)
        {
            ClienteAddAllIncludes clienteAddAllIncludes = new();
            return await _repository.GetByIdAsync(clienteId, clienteAddAllIncludes);
        }

        // Centralized method for getting Funcionalidade
        protected async Task<Funcionalidade> GetFuncionalidadeByIdAsync(Guid funcionalidadeId)
        {
            FuncionalidadeAddAllIncludes funcionalidadeAddAllIncludes = new();
            return await _repository.GetByIdAsync(funcionalidadeId, funcionalidadeAddAllIncludes);
        }

        // Centralized method for getting Licenca
        protected async Task<Licenca> GetLicencaByIdAsync(Guid licencaId)
        {
            LicencaAddAllIncludes licencaAddAllIncludes = new();
            return await _repository.GetByIdAsync(licencaId, licencaAddAllIncludes);
        }

        // Centralized method for getting Licenca By UtilizadorId
        protected async Task<Licenca> GetLicencaByUtilizadorIdAsync(string utilizadorId)
        {
            LicencaMatchUtilizadorId licencaMatchUtilizadorId = new(utilizadorId);
            return await _repository.FirstOrDefaultAsync<Licenca, Guid>(licencaMatchUtilizadorId);
        }

        // Centralized method for getting Perfil
        protected async Task<Perfil> GetPerfilByIdAsync(Guid perfilId)
        {
            PerfilAddAllIncludes perfilAddAllIncludes = new();
            return await _repository.GetByIdAsync(perfilId, perfilAddAllIncludes);
        }

        // Centralized method for getting Modulo
        protected async Task<Modulo> GetModuloByIdAsync(Guid moduloId)
        {
            ModuloAddAllIncludes moduloAddAllIncludes = new();
            return await _repository.GetByIdAsync(moduloId, moduloAddAllIncludes);
        }

        public enum GuidIncrementType
        {
            Application, // Increments first number: 10000000 → 20000000
            Module, // Increments last number based on parent Application
            Feature // Increments second to last group and last number based on parent Module
            ,
        }

        protected async Task<Guid> GenerateNextIdAsync(
            GuidIncrementType incrementType = GuidIncrementType.Application,
            Guid? parentId = null
        )
        {
            switch (incrementType)
            {
                case GuidIncrementType.Application:
                    var maxAppId = (await _repository.GetListAsync<Aplicacao, Guid>())
                        .OrderByDescending(e => e.Id)
                        .Select(e => e.Id)
                        .FirstOrDefault();

                    if (maxAppId == Guid.Empty)
                    {
                        return new Guid("00000001-0000-0000-0000-000000000000");
                    }

                    byte[] appBytes = maxAppId.ToByteArray();
                    if (appBytes[0] == 0x99) // Handle overflow (99 -> 100)
                    {
                        appBytes[1]++;
                        appBytes[0] = 0;
                    }
                    else if ((appBytes[0] & 0x0F) == 0x09) // Handle decimal overflow (9 -> 10, 19 -> 20, etc)
                    {
                        appBytes[0] += 7; // Skip over A-F
                    }
                    else
                    {
                        appBytes[0]++;
                    }
                    return new Guid(appBytes);

                case GuidIncrementType.Module:
                    if (parentId == null)
                        throw new ArgumentNullException(
                            nameof(parentId),
                            "Parent Application ID is required for Module"
                        );

                    var maxModuleId = (await _repository.GetListAsync<Modulo, Guid>())
                        .Where(e => e.AplicacaoId == parentId)
                        .OrderByDescending(e => e.Id)
                        .Select(e => e.Id)
                        .FirstOrDefault();

                    if (maxModuleId == Guid.Empty)
                    {
                        byte[] newModuleBytes = parentId.Value.ToByteArray();
                        newModuleBytes[15] = 1;
                        return new Guid(newModuleBytes);
                    }

                    byte[] moduleBytes = maxModuleId.ToByteArray();
                    if (moduleBytes[15] == 0x99) // Handle overflow (99 -> 100)
                    {
                        moduleBytes[14]++;
                        moduleBytes[15] = 0;
                    }
                    else if ((moduleBytes[15] & 0x0F) == 0x09) // Handle decimal overflow (9 -> 10, 19 -> 20, etc)
                    {
                        moduleBytes[15] += 7; // Skip over A-F
                    }
                    else
                    {
                        moduleBytes[15]++;
                    }
                    return new Guid(moduleBytes);

                case GuidIncrementType.Feature:
                    if (parentId == null)
                        throw new ArgumentNullException(
                            nameof(parentId),
                            "Parent Module ID is required for Feature"
                        );

                    var maxFeatureId = (await _repository.GetListAsync<Funcionalidade, Guid>())
                        .Where(e => e.ModuloId == parentId)
                        .OrderByDescending(e => e.Id)
                        .Select(e => e.Id)
                        .FirstOrDefault();

                    if (maxFeatureId == Guid.Empty)
                    {
                        byte[] newFeatureBytes = parentId.Value.ToByteArray();
                        newFeatureBytes[9] = 1;
                        // newFeatureBytes[15] = 1;
                        return new Guid(newFeatureBytes);
                    }

                    byte[] featureBytes = maxFeatureId.ToByteArray();
                    if (featureBytes[9] == 0x99) // Handle overflow (99 -> 100)
                    {
                        featureBytes[8]++;
                        featureBytes[9] = 0;
                    }
                    else if ((featureBytes[9] & 0x0F) == 0x09) // Handle decimal overflow (9 -> 10, 19 -> 20, etc)
                    {
                        featureBytes[9] += 7; // Skip over A-F
                    }
                    else
                    {
                        featureBytes[9]++;
                    }
                    return new Guid(featureBytes);

                default:
                    throw new ArgumentException("Invalid increment type");
            }
        }
    }
}
