import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateEntidadeDTO,
  EntidadeDTO,
  UpdateEntidadeDTO,
} from '@/types/dtos/base/entidades.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { EntidadeError } from './entidades-errors'

export class EntidadesClient extends BaseApiClient {
  public async getEntidadesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<EntidadeDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/entidades/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<EntidadeDTO>
          >(state.URL, '/client/base/entidades/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EntidadeError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EntidadeError(
            'Falha ao obter entidades paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getEntidades(): Promise<ResponseApi<GSResponse<EntidadeDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/entidades')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EntidadeDTO[]>
          >(state.URL, '/client/base/entidades')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EntidadeError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EntidadeError('Falha ao obter entidades', undefined, error)
        }
      })
    )
  }

  public async createEntidade(
    data: CreateEntidadeDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateEntidadeDTO,
          GSResponse<string>
        >(state.URL, '/client/base/entidades', data)

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

  public async updateEntidade(
    id: string,
    data: UpdateEntidadeDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateEntidadeDTO,
          GSResponse<string>
        >(state.URL, `/client/base/entidades/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EntidadeError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EntidadeError('Falha ao atualizar entidade', undefined, error)
      }
    })
  }

  public async deleteEntidade(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/entidades/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EntidadeError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EntidadeError('Falha ao apagar entidade', undefined, error)
      }
    })
  }

  public async deleteMultipleEntidades(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/entidades/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EntidadeError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EntidadeError(
          'Falha ao apagar múltiplas entidades',
          undefined,
          error
        )
      }
    })
  }

  public async getEntidade(
    id: string
  ): Promise<ResponseApi<GSResponse<EntidadeDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/entidades/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EntidadeDTO>
          >(state.URL, `/client/base/entidades/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EntidadeError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EntidadeError('Falha ao obter entidade', undefined, error)
        }
      })
    )
  }
}
