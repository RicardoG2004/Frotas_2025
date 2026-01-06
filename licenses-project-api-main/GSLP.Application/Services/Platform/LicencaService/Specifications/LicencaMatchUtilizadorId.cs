using Ardalis.Specification;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaMatchUtilizadorId : LicencaAddAllIncludes
    {
        public LicencaMatchUtilizadorId(string utilizadorId)
        {
            // Add any additional conditions specific to this specification
            _ = Query.Where(l => l.LicencasUtilizadores.Any(lu => lu.UtilizadorId == utilizadorId));
        }
    }
}
