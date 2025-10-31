using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.FornecedorService.DTOs;
using Frotas.API.Application.Services.Frotas.FornecedorService.Filters;

namespace Frotas.API.Application.Services.Frotas.FornecedorService
{
  public interface IFornecedorService : ITransientService
  {
    Task<Response<IEnumerable<FornecedorDTO>>> GetFornecedoresAsync(string keyword = "");
    Task<PaginatedResponse<FornecedorDTO>> GetFornecedoresPaginatedAsync(FornecedorTableFilter filter);
    Task<Response<FornecedorDTO>> GetFornecedorAsync(Guid id);
    Task<Response<Guid>> CreateFornecedorAsync(CreateFornecedorRequest request);
    Task<Response<Guid>> UpdateFornecedorAsync(UpdateFornecedorRequest request, Guid id);
    Task<Response<Guid>> DeleteFornecedorAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleFornecedoresAsync(IEnumerable<Guid> ids);
  }
}

