using GSLP.Application.Common.Marker;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Services.Application.AppUpdateService.DTOs;
using GSLP.Application.Services.Application.AppUpdateService.Filters;

namespace GSLP.Application.Services.Application.AppUpdateService
{
  public interface IAppUpdateService : ITransientService
  {
    #region [-- APPUPDATE - API METHODS --]

    Task<Response<IEnumerable<AppUpdateDTO>>> GetAppUpdatesResponseAsync(
      Guid aplicacaoId,
      string keyword = ""
    );
    Task<PaginatedResponse<AppUpdateDTO>> GetAppUpdatesPaginatedResponseAsync(
      AppUpdateTableFilter filter
    );
    Task<Response<AppUpdateDTO>> GetAppUpdateResponseAsync(Guid id);
    Task<Response<Guid>> CreateAppUpdateResponseAsync(CreateAppUpdateRequest request);
    Task<Response<Guid>> UpdateAppUpdateResponseAsync(UpdateAppUpdateRequest request, Guid id);
    Task<Response<Guid>> DeleteAppUpdateResponseAsync(Guid id);
    Task<Response<CheckUpdateResponse>> CheckForUpdateResponseAsync(CheckUpdateRequest request);
    Task<Response<AppUpdateDTO>> GetLatestUpdateResponseAsync(Guid aplicacaoId);
    Task<Response<Guid>> UpdateAppUpdateFileInfoResponseAsync(
      Guid id,
      string fileName,
      long fileSize,
      string fileHash,
      int? packageType = null
    );
    Task<Response<Guid>> DeleteAppUpdatePackageResponseAsync(Guid id, int? packageType = null);
    Task<Response<AppUpdateStatisticsDTO>> GetAppUpdateStatisticsResponseAsync(Guid aplicacaoId);

    #endregion [-- APPUPDATE - API METHODS --]
  }
}
