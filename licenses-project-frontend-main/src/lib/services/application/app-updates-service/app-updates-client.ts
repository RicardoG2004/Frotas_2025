import { GSGenericResponse, GSResponse } from '@/types/api/responses'
import { PaginatedRequest, PaginatedResponse } from '@/types/api/responses'
import {
  AppUpdateDTO,
  CreateAppUpdateDTO,
  UpdateAppUpdateDTO,
  CheckUpdateRequest,
  CheckUpdateResponse,
  AppUpdateStatisticsDTO,
  UpdateType,
} from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { AppUpdateError } from './app-update-error'

export class AppUpdatesClient extends BaseApiClient {
  public async getUpdatesForAplicacao(
    aplicacaoId: string,
    keyword?: string
  ): Promise<ResponseApi<GSResponse<AppUpdateDTO[]>>> {
    const url = keyword
      ? `/api/AppUpdates/aplicacao/${aplicacaoId}?keyword=${encodeURIComponent(keyword)}`
      : `/api/AppUpdates/aplicacao/${aplicacaoId}`

    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.getRequest<GSResponse<AppUpdateDTO[]>>(url)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao obter atualizações',
          undefined,
          error
        )
      }
    })
  }

  public async getUpdateById(
    id: string
  ): Promise<ResponseApi<GSResponse<AppUpdateDTO>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<AppUpdateDTO>
        >(`/api/AppUpdates/${id}`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError('Falha ao obter atualização', undefined, error)
      }
    })
  }

  public async createUpdate(
    data: CreateAppUpdateDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateAppUpdateDTO,
          GSResponse<string>
        >('/api/AppUpdates', data)

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message,
          }
        }
        throw error
      }
    })
  }

  public async updateUpdate(
    id: string,
    data: UpdateAppUpdateDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateAppUpdateDTO,
          GSResponse<string>
        >(`/api/AppUpdates/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao atualizar atualização',
          undefined,
          error
        )
      }
    })
  }

  public async deleteUpdate(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/AppUpdates/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao deletar atualização',
          undefined,
          error
        )
      }
    })
  }

  public async getUpdatesPaginated(
    aplicacaoId: string,
    params: Omit<PaginatedRequest, 'filters'> & {
      filters?: Array<{ id: string; value: string }>
      keyword?: string
    }
  ): Promise<ResponseApi<PaginatedResponse<AppUpdateDTO>>> {
    return this.withRetry(async () => {
      try {
        // Include aplicacaoId in the request body as per API specification
        // Backend expects filters as array, not Record
        const requestBody = {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          sorting: params.sorting || [],
          filters: params.filters || [],
          keyword: params.keyword || '',
          aplicacaoId: aplicacaoId,
        }

        const response = await this.httpClient.postRequest<
          typeof requestBody,
          PaginatedResponse<AppUpdateDTO>
        >(`/api/AppUpdates/aplicacao/${aplicacaoId}/paginated`, requestBody)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao obter atualizações paginadas',
          undefined,
          error
        )
      }
    })
  }

  public async getUpdateStatistics(
    aplicacaoId: string
  ): Promise<ResponseApi<GSResponse<AppUpdateStatisticsDTO>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<AppUpdateStatisticsDTO>
        >(`/api/AppUpdates/aplicacao/${aplicacaoId}/statistics`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao obter estatísticas',
          undefined,
          error
        )
      }
    })
  }

  public async uploadUpdatePackage(
    id: string,
    file: File,
    onProgress?: (progress: number) => void,
    packageType?: UpdateType
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        // Add packageType query param when specified (required for Both type)
        const url = packageType
          ? `/api/AppUpdates/${id}/upload?packageType=${packageType}`
          : `/api/AppUpdates/${id}/upload`

        const response = await this.httpClient.uploadFileRequest<
          GSResponse<string>
        >(url, file, onProgress)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao fazer upload do pacote de atualização',
          undefined,
          error
        )
      }
    })
  }

  public async checkUpdate(
    data: CheckUpdateRequest
  ): Promise<ResponseApi<GSResponse<CheckUpdateResponse>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CheckUpdateRequest,
          GSResponse<CheckUpdateResponse>
        >('/api/AppUpdates/check', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao verificar atualização',
          undefined,
          error
        )
      }
    })
  }

  public async getLatestUpdate(
    aplicacaoId: string
  ): Promise<ResponseApi<GSResponse<AppUpdateDTO>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<AppUpdateDTO>
        >(`/api/AppUpdates/latest/aplicacao/${aplicacaoId}`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao obter última atualização',
          undefined,
          error
        )
      }
    })
  }

  public async downloadUpdatePackage(
    id: string,
    onProgress?: (progress: number) => void,
    packageType?: UpdateType
  ): Promise<Blob> {
    return this.withRetry(async () => {
      try {
        // Add packageType query param when specified (required for Both type)
        const url = packageType
          ? `/api/AppUpdates/${id}/download?packageType=${packageType}`
          : `/api/AppUpdates/${id}/download`

        const blob = await this.httpClient.downloadFileRequest(url, onProgress)

        return blob
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao descarregar pacote de atualização',
          undefined,
          error
        )
      }
    })
  }

  public async deleteUpdatePackage(
    id: string,
    packageType?: UpdateType
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        // Add packageType query param when specified (required for Both type)
        const url = packageType
          ? `/api/AppUpdates/${id}/package?packageType=${packageType}`
          : `/api/AppUpdates/${id}/package`

        const response =
          await this.httpClient.deleteRequest<GSGenericResponse>(url)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AppUpdateError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AppUpdateError(
          'Falha ao remover pacote de atualização',
          undefined,
          error
        )
      }
    })
  }
}
