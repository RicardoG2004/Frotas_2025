using Ardalis.Specification;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.Specifications
{
  public class EntidadeContactoSearchTable : Specification<EntidadeContacto>
  {
    public EntidadeContactoSearchTable(string? name = "", string? dynamicOrder = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(x => x.Valor.Contains(name));
      }

      // sort order
      if (string.IsNullOrEmpty(dynamicOrder))
      {
        _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
      }
      else
      {
        _ = Query.OrderBy(dynamicOrder); // dynamic (JQDT) sort order
      }
    }
  }
}
