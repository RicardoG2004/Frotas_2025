using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FseService.Specifications
{
    public class FseSearchList : Specification<Fse>
    {
        public FseSearchList(string? keyword = "")
        {
            // includes
            _ = Query.Include(x => x.CodigoPostal);
            _ = Query.Include(x => x.Pais);

            // filters
            if (!string.IsNullOrEmpty(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword) || x.NumContribuinte.Contains(keyword));
            }

            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}