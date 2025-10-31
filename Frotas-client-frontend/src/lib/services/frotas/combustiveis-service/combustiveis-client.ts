import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CombustivelDTO,
  CreateCombustivelDTO,
  UpdateCombustivelDTO,
} from '@/types/dtos/frotas/combustiveis.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
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

  public async createCombustivel(
    data: CreateCombustivelDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCombustivelDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/combustiveis', data)

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

  public async updateCombustivel(
    id: string,
    data: UpdateCombustivelDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCombustivelDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/combustiveis/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CombustivelError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CombustivelError('Falha ao atualizar combustível', undefined, error)
      }
    })
  }

  public async deleteCombustivel(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/combustiveis/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CombustivelError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CombustivelError('Falha ao apagar combustível', undefined, error)
      }
    })
  }

  public async deleteMultipleCombustiveis(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/combustiveis/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CombustivelError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CombustivelError('Falha ao apagar combustíveis', undefined, error)
      }
    })
  }
}

