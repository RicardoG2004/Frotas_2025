import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ProprietarioDTO,
  CreateProprietarioDTO,
  UpdateProprietarioDTO,
} from '@/types/dtos/cemiterios/proprietarios.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ProprietarioError } from './proprietarios-errors'

export class ProprietariosClient extends BaseApiClient {
  public async getProprietariosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ProprietarioDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/proprietarios/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ProprietarioDTO>
          >(state.URL, '/client/cemiterios/proprietarios/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ProprietarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ProprietarioError(
            'Falha ao obter proprietários paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getProprietarios(): Promise<
    ResponseApi<GSResponse<ProprietarioDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/cemiterios/proprietarios')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ProprietarioDTO[]>
          >(state.URL, '/client/cemiterios/proprietarios')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ProprietarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ProprietarioError(
            'Falha ao obter proprietários',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getProprietariosByCemiterioId(
    cemiterioId: string
  ): Promise<ResponseApi<GSResponse<ProprietarioDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/proprietarios/cemiterio/${cemiterioId}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ProprietarioDTO[]>
          >(
            state.URL,
            `/client/cemiterios/proprietarios/cemiterio/${cemiterioId}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new Error('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new Error('Falha ao obter proprietários do cemitério')
        }
      })
    )
  }

  public async getProprietario(
    id: string
  ): Promise<ResponseApi<GSResponse<ProprietarioDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/proprietarios/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ProprietarioDTO>
          >(state.URL, `/client/cemiterios/proprietarios/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ProprietarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ProprietarioError(
            'Falha ao obter proprietário',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createProprietario(
    data: CreateProprietarioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateProprietarioDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/proprietarios', data)

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

  public async updateProprietario(
    id: string,
    data: UpdateProprietarioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateProprietarioDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/proprietarios/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ProprietarioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ProprietarioError(
          'Falha ao atualizar proprietário',
          undefined,
          error
        )
      }
    })
  }

  public async deleteProprietario(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/proprietarios/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ProprietarioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ProprietarioError(
          'Falha ao apagar proprietário',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleProprietarios(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/proprietarios/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ProprietarioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ProprietarioError(
          'Falha ao apagar proprietários',
          undefined,
          error
        )
      }
    })
  }
}
