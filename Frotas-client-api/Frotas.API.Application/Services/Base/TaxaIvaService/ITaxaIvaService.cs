using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;
using Frotas.API.Application.Services.Base.TaxaIvaService.Filters;

namespace Frotas.API.Application.Services.Base.TaxaIvaService
{
  public interface ITaxaIvaService : ITransientService
  {
    Task<Response<IEnumerable<TaxaIvaDTO>>> GetTaxasIvaAsync(string keyword = "");
    Task<PaginatedResponse<TaxaIvaDTO>> GetTaxasIvaPaginatedAsync(TaxaIvaTableFilter filter);
    Task<Response<TaxaIvaDTO>> GetTaxaIvaAsync(Guid id);
    Task<Response<Guid>> CreateTaxaIvaAsync(CreateTaxaIvaRequest request);
    Task<Response<Guid>> UpdateTaxaIvaAsync(UpdateTaxaIvaRequest request, Guid id);
    Task<Response<Guid>> DeleteTaxaIvaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleTaxasIvaAsync(IEnumerable<Guid> ids);
  }
}