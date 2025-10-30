import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import { CreateRuaDTO, RuaDTO, UpdateRuaDTO } from '@/types/dtos/base/ruas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { RuaError } from './ruas-errors'

export class RuasClient extends BaseApiClient {
  public async getRuasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<RuaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/ruas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<RuaDTO>
          >(state.URL, '/client/base/ruas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RuaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RuaError('Falha ao obter ruas paginadas', undefined, error)
        }
      })
    )
  }

  public async getRuas(): Promise<ResponseApi<GSResponse<RuaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/ruas')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<RuaDTO[]>
          >(state.URL, '/client/base/ruas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RuaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RuaError('Falha ao obter ruas', undefined, error)
        }
      })
    )
  }

  public async getRua(id: string): Promise<ResponseApi<GSResponse<RuaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/ruas/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<RuaDTO>>(
            state.URL,
            `/client/base/ruas/${id}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RuaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RuaError('Falha ao obter rua', undefined, error)
        }
      })
    )
  }

  public async createRua(
    data: CreateRuaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateRuaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/ruas', data)

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

  public async updateRua(
    id: string,
    data: UpdateRuaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateRuaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/ruas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RuaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RuaError('Falha ao atualizar rua', undefined, error)
      }
    })
  }

  public async deleteRua(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/ruas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RuaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RuaError('Falha ao apagar rua', undefined, error)
      }
    })
  }

  public async deleteMultipleRuas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/ruas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RuaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RuaError('Falha ao apagar múltiplas ruas', undefined, error)
      }
    })
  }
}
