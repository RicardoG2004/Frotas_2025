using System;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Common.Wrapper;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.Filters;

namespace Frotas.API.Application.Services.Frotas.ViaturaService
{
  public interface IViaturaService : ITransientService
  {
    Task<Response<IEnumerable<ViaturaDTO>>> GetViaturasAsync(string keyword = "");
    Task<PaginatedResponse<ViaturaDTO>> GetViaturasPaginatedAsync(ViaturaTableFilter filter);
    Task<Response<ViaturaDTO>> GetViaturaAsync(Guid id);
    Task<Response<Guid>> CreateViaturaAsync(CreateViaturaRequest request);
    Task<Response<Guid>> UpdateViaturaAsync(UpdateViaturaRequest request, Guid id);
    Task<Response<Guid>> DeleteViaturaAsync(Guid id);
    Task<Response<IEnumerable<Guid>>> DeleteMultipleViaturasAsync(IEnumerable<Guid> ids);
  }
}

