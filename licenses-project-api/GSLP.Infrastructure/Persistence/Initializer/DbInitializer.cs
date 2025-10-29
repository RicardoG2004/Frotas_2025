using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public static class DbInitializer
    {
        public static void SeedAdministratorAndRoles(ApplicationDbContext context)
        {
            ArgumentNullException.ThrowIfNull(context, nameof(context));

            IDbInitializer[] initializers =
            [
                new UserRoleInitializer(),
                new AreaInitializer(),
                new AplicacaoInitializer(),
                new ModulosInitializer(),
                new FuncionalidadesInitializer(),
                new ClientesInitializer(),
                new LicencasInitializer(),
                new ClienteUsersInitializer(),
            ];

            foreach (var initializer in initializers)
            {
                initializer.Initialize(context);
            }

            _ = context.SaveChanges();
        }
    }
}
