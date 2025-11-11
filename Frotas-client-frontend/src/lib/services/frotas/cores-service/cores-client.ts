import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateCorDTO,
  CorDTO,
  UpdateCorDTO,
} from '@/types/dtos/frotas/cores.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CorError } from './cores-errors'

const BASE_ROUTE = '/client/frotas/cores'

export class CoresClient extends BaseApiClient {
  public async getCoresPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CorDTO>>> {
    const cacheKey = this.getCacheKey('POST', `${BASE_ROUTE}/paginated`, params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CorDTO>
          >(state.URL, `${BASE_ROUTE}/paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CorError('Falha ao obter cores paginadas', undefined, error)
        }
      })
    )
  }

  public async getCores(): Promise<ResponseApi<GSResponse<CorDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', BASE_ROUTE)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<CorDTO[]>>(
            state.URL,
            BASE_ROUTE
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CorError('Falha ao obter cores', undefined, error)
        }
      })
    )
  }

  public async getCor(
    id: string
  ): Promise<ResponseApi<GSResponse<CorDTO>>> {
    const cacheKey = this.getCacheKey('GET', `${BASE_ROUTE}/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<CorDTO>>(
            state.URL,
            `${BASE_ROUTE}/${id}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CorError('Falha ao obter cor', undefined, error)
        }
      })
    )
  }

  public async createCor(
    data: CreateCorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCorDTO,
          GSResponse<string>
        >(state.URL, BASE_ROUTE, data)

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

  public async updateCor(
    id: string,
    data: UpdateCorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCorDTO,
          GSResponse<string>
        >(state.URL, `${BASE_ROUTE}/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CorError('Falha ao atualizar cor', undefined, error)
      }
    })
  }

  public async deleteCor(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `${BASE_ROUTE}/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CorError('Falha ao apagar cor', undefined, error)
      }
    })
  }

  public async deleteMultipleCores(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, `${BASE_ROUTE}/bulk`, { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CorError('Falha ao apagar múltiplas cores', undefined, error)
      }
    })
  }
}


