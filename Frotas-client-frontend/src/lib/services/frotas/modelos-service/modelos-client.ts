import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ModeloDTO,
  CreateModeloDTO,
  UpdateModeloDTO,
} from '@/types/dtos/frotas/modelos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ModeloError } from './modelos-errors'

export class ModelosClient extends BaseApiClient {
  public async getModelosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ModeloDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/modelos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ModeloDTO>
          >(state.URL, '/client/frotas/modelos/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ModeloError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ModeloError(
            'Falha ao obter modelos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getModelos(): Promise<ResponseApi<GSResponse<ModeloDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/modelos')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ModeloDTO[]>
          >(state.URL, '/client/frotas/modelos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ModeloError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ModeloError('Falha ao obter modelos', undefined, error)
        }
      })
    )
  }

  public async getModelo(
    id: string
  ): Promise<ResponseApi<GSResponse<ModeloDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/modelos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ModeloDTO>
          >(state.URL, `/client/frotas/modelos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ModeloError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ModeloError('Falha ao obter modelo', undefined, error)
        }
      })
    )
  }

  public async createModelo(
    data: CreateModeloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateModeloDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/modelos', data)

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

  public async updateModelo(
    id: string,
    data: UpdateModeloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateModeloDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/modelos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModeloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModeloError('Falha ao atualizar modelo', undefined, error)
      }
    })
  }

  public async deleteModelo(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/modelos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModeloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModeloError('Falha ao apagar modelo', undefined, error)
      }
    })
  }

  public async deleteMultipleModelos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/modelos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModeloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModeloError('Falha ao apagar modelos', undefined, error)
      }
    })
  }
}

