using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public interface IDbInitializer
    {
        void Initialize(ApplicationDbContext context);
    }
}
