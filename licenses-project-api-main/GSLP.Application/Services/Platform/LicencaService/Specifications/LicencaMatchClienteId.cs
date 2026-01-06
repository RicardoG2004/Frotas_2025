using Ardalis.Specification;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaMatchClienteId : LicencaAddAllIncludes
    {
        public LicencaMatchClienteId(Guid clienteId)
        {
            _ = Query.Where(l => l.ClienteId == clienteId);
        }
    }
}
