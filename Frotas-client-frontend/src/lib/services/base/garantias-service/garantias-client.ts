import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateGarantiaDTO,
  GarantiaDTO,
  UpdateGarantiaDTO,
} from '@/types/dtos/base/garantias.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { GarantiaError } from './garantias-errors'

export class GarantiasClient extends BaseApiClient {
  public async getGarantiasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<GarantiaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/garantias/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<GarantiaDTO>
          >(state.URL, '/client/base/garantias/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new GarantiaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new GarantiaError(
            'Falha ao obter garantias paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getGarantias(): Promise<ResponseApi<GSResponse<GarantiaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/garantias')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<GarantiaDTO[]>
          >(state.URL, '/client/base/garantias')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new GarantiaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new GarantiaError('Falha ao obter garantias', undefined, error)
        }
      })
    )
  }

  public async createGarantia(
    data: CreateGarantiaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateGarantiaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/garantias', data)

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

  public async updateGarantia(
    id: string,
    data: UpdateGarantiaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateGarantiaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/garantias/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new GarantiaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new GarantiaError('Falha ao atualizar garantia', undefined, error)
      }
    })
  }

  public async deleteGarantia(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/garantias/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new GarantiaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new GarantiaError('Falha ao apagar garantia', undefined, error)
      }
    })
  }

  public async deleteMultipleGarantias(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/garantias/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new GarantiaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new GarantiaError(
          'Falha ao apagar múltiplas garantias',
          undefined,
          error
        )
      }
    })
  }

  public async getGarantia(
    id: string
  ): Promise<ResponseApi<GSResponse<GarantiaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/garantias/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<GarantiaDTO>
          >(state.URL, `/client/base/garantias/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new GarantiaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new GarantiaError('Falha ao obter garantia', undefined, error)
        }
      })
    )
  }
}


