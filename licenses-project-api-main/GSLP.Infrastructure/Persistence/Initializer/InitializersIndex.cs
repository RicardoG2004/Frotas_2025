using GSLP.Infrastructure.Persistence.Initializer.Clicloud;
using GSLP.Infrastructure.Persistence.Initializer.GAcloud;
using GSLP.Infrastructure.Persistence.Initializer.GSLPManager;
using GSLP.Infrastructure.Persistence.Initializer.Realcloud;
using GSLP.Infrastructure.Persistence.Initializer.Tucloud;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    /// <summary>
    /// Centralized index of all application-specific initializers.
    /// This provides a single place to register all app initializers.
    /// </summary>
    public static class InitializersIndex
    {
        /// <summary>
        /// Gets all application-specific modulos and funcionalidades initializers.
        /// </summary>
        /// <returns>Array of IDbInitializer instances for all applications</returns>
        public static IDbInitializer[] GetApplicationInitializers()
        {
            return
            [
                // GSLP Manager
                new GSLPManagerModulosInitializer(),
                new GSLPManagerFuncionalidadesInitializer(),
                // Clicloud
                new ClicloudModulosInitializer(),
                new ClicloudFuncionalidadesInitializer(),
                // GAcloud
                new GAcloudModulosInitializer(),
                new GAcloudFuncionalidadesInitializer(),
                // Realcloud
                new RealcloudModulosInitializer(),
                new RealcloudFuncionalidadesInitializer(),
                // Tucloud
                new TucloudModulosInitializer(),
                new TucloudFuncionalidadesInitializer(),
            ];
        }
    }
}

