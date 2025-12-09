using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FseService.Specifications
{
    public class FseSearchTable : Specification<Fse>
    {
        public FseSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
        {
            // includes
            _ = Query.Include(x => x.CodigoPostal);
            _ = Query.Include(x => x.Pais);

            // filters
            if ( filters != null && filters.Count != 0 )
            {
                foreach ( TableFilter filter in filters )
                {
                    switch ( filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
                    {
                        case "nome":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Nome.Contains(filter.Value));
                            }
                            break;
                        case "numcontribuinte":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.NumContribuinte.Contains(filter.Value));
                            }
                            break;
                        case "morada":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Morada.Contains(filter.Value));
                            }
                            break;
                        case "codigopostalid":
                            if (Guid.TryParse(filter.Value, out Guid codigoPostalId))
                            {
                                _ = Query.Where(x => x.CodigoPostalId == codigoPostalId);
                            }
                            break;
                        case "paisid":
                            if (Guid.TryParse(filter.Value, out Guid paisId))
                            {
                                _ = Query.Where(x => x.PaisId == paisId);
                            }
                            break;
                        case "contacto":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Contacto.Contains(filter.Value));
                            }
                            break;
                        case "telefone":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Telefone.Contains(filter.Value));
                            }
                            break;
                        case "fax":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Fax.Contains(filter.Value));
                            }
                            break;
                        case "email":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Email.Contains(filter.Value));
                            }
                            break;
                        case "enderecohttp":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.EnderecoHttp.Contains(filter.Value));
                            }
                            break;
                        case "origem":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Origem != null && x.Origem.Contains(filter.Value));
                            }
                            break;
                    }
                }
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