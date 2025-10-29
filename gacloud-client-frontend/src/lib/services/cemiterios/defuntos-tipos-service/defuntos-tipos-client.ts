import state from '@/states/state'
import {
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  DefuntoTipoDTO,
  CreateDefuntoTipoDTO,
  UpdateDefuntoTipoDTO,
} from '@/types/dtos/cemiterios/defuntos-tipos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { DefuntoTipoError } from './defuntos-tipos-errors'

export class DefuntoTipoClient extends BaseApiClient {
  public async getDefuntosTiposPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<DefuntoTipoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/defuntos/tipos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<DefuntoTipoDTO>
          >(state.URL, '/client/cemiterios/defuntos/tipos/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DefuntoTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DefuntoTipoError(
            'Falha ao obter tipos de defuntos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getDefuntosTipos(): Promise<
    ResponseApi<GSResponse<DefuntoTipoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/cemiterios/defuntos/tipos'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DefuntoTipoDTO[]>
          >(state.URL, '/client/cemiterios/defuntos/tipos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DefuntoTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DefuntoTipoError(
            'Falha ao obter tipos de defuntos',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getDefuntoTipo(
    id: string
  ): Promise<ResponseApi<GSResponse<DefuntoTipoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/defuntos/tipos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DefuntoTipoDTO>
          >(state.URL, `/client/cemiterios/defuntos/tipos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DefuntoTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DefuntoTipoError(
            'Falha ao obter tipo de defunto',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createDefuntoTipo(
    data: CreateDefuntoTipoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateDefuntoTipoDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/defuntos/tipos', data)

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

  public async updateDefuntoTipo(
    id: string,
    data: UpdateDefuntoTipoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateDefuntoTipoDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/defuntos/tipos/${id}`, data)

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

  public async deleteDefuntoTipo(
    id: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<
          GSResponse<string>
        >(state.URL, `/client/cemiterios/defuntos/tipos/${id}`)

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

  public async deleteMultipleDefuntosTipos(
    ids: string[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSResponse<string>
        >(state.URL, '/client/cemiterios/defuntos/tipos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DefuntoTipoError('Formato de resposta inválido')
        }

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
        throw new DefuntoTipoError(
          'Falha ao apagar tipos de defunto',
          undefined,
          error
        )
      }
    })
  }
}
