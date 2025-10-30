import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateDistritoDTO,
  DistritoDTO,
  UpdateDistritoDTO,
} from '@/types/dtos/base/distritos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { DistritoError } from './distritos-errors'

export class DistritosClient extends BaseApiClient {
  public async getDistritosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<DistritoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/distritos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<DistritoDTO>
          >(state.URL, '/client/base/distritos/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DistritoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DistritoError(
            'Falha ao obter distritos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getDistritos(): Promise<ResponseApi<GSResponse<DistritoDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/distritos')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DistritoDTO[]>
          >(state.URL, '/client/base/distritos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DistritoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DistritoError('Falha ao obter distritos', undefined, error)
        }
      })
    )
  }

  public async createDistrito(
    data: CreateDistritoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateDistritoDTO,
          GSResponse<string>
        >(state.URL, '/client/base/distritos', data)

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

  public async updateDistrito(
    id: string,
    data: UpdateDistritoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateDistritoDTO,
          GSResponse<string>
        >(state.URL, `/client/base/distritos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DistritoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DistritoError('Falha ao atualizar distrito', undefined, error)
      }
    })
  }

  public async deleteDistrito(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/distritos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DistritoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DistritoError('Falha ao apagar distrito', undefined, error)
      }
    })
  }

  public async deleteMultipleDistritos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/distritos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DistritoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DistritoError(
          'Falha ao apagar múltiplos distritos',
          undefined,
          error
        )
      }
    })
  }

  public async getDistrito(
    id: string
  ): Promise<ResponseApi<GSResponse<DistritoDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/distritos/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DistritoDTO>
          >(state.URL, `/client/base/distritos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DistritoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DistritoError('Falha ao obter distrito', undefined, error)
        }
      })
    )
  }
}
