using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.Filters;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService
{
  public interface ITipoViaturaService : ITransientService
  {
    Task<Response<IEnumerable<TipoViaturaDTO>>> GetTipoViaturasAsync(string keyword = "");
    Task<PaginatedResponse<TipoViaturaDTO>> GetTipoViaturasPaginatedAsync(TipoViaturaTableFilter filter);
    Task<Response<TipoViaturaDTO>> GetTipoViaturaAsync(Guid id);
    Task<Response<Guid>> CreateTipoViaturaAsync(CreateTipoViaturaRequest request);
    Task<Response<Guid>> UpdateTipoViaturaAsync(UpdateTipoViaturaRequest request, Guid id);
    Task<Response<Guid>> DeleteTipoViaturaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleTipoViaturasAsync(IEnumerable<Guid> ids);
  }
}
