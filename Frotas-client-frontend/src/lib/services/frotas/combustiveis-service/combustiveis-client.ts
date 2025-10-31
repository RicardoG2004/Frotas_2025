import state from '@/states/state'
import {
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CombustivelDTO,
} from '@/types/dtos/frotas/combustiveis.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { CombustivelError } from './combustiveis-errors'

export class CombustiveisClient extends BaseApiClient {
  public async getCombustiveisPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CombustivelDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/combustiveis/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CombustivelDTO>
          >(state.URL, '/client/frotas/combustiveis/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CombustivelError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CombustivelError(
            'Falha ao obter combustíveis paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCombustiveis(): Promise<ResponseApi<GSResponse<CombustivelDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/combustiveis')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CombustivelDTO[]>
          >(state.URL, '/client/frotas/combustiveis')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CombustivelError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CombustivelError('Falha ao obter combustíveis', undefined, error)
        }
      })
    )
  }

  public async getCombustivel(
    id: string
  ): Promise<ResponseApi<GSResponse<CombustivelDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/combustiveis/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CombustivelDTO>
          >(state.URL, `/client/frotas/combustiveis/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CombustivelError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CombustivelError('Falha ao obter combustível', undefined, error)
        }
      })
    )
  }
}

