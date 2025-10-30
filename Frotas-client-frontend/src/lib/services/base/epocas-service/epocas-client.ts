import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateEpocaDTO,
  EpocaDTO,
  UpdateEpocaDTO,
} from '@/types/dtos/base/epocas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { EpocaError } from './epocas-errors'

export class EpocasClient extends BaseApiClient {
  public async getEpocasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<EpocaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/epocas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<EpocaDTO>
          >(state.URL, '/client/base/epocas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EpocaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EpocaError(
            'Falha ao obter épocas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getEpocas(): Promise<ResponseApi<GSResponse<EpocaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/epocas')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EpocaDTO[]>
          >(state.URL, '/client/base/epocas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EpocaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EpocaError('Falha ao obter épocas', undefined, error)
        }
      })
    )
  }

  public async createEpoca(
    data: CreateEpocaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateEpocaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/epocas', data)

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          // If it's a validation error, return it as a response
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

  public async updateEpoca(
    id: string,
    data: UpdateEpocaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateEpocaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/epocas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EpocaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EpocaError('Falha ao atualizar época', undefined, error)
      }
    })
  }

  public async deleteEpoca(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/epocas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EpocaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EpocaError('Falha ao apagar época', undefined, error)
      }
    })
  }

  public async deleteMultipleEpocas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/epocas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EpocaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EpocaError(
          'Falha ao apagar múltiplas épocas',
          undefined,
          error
        )
      }
    })
  }

  public async getPredefinedEpoca(): Promise<
    ResponseApi<GSResponse<EpocaDTO>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/base/epocas/predefinida')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EpocaDTO>
          >(state.URL, '/client/base/epocas/predefinida')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EpocaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EpocaError(
            'Falha ao obter época predefinida',
            undefined,
            error
          )
        }
      })
    )
  }
}
