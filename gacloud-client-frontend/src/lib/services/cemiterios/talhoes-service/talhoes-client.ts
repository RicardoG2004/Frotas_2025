import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  TalhaoDTO,
  CreateTalhaoDTO,
  UpdateTalhaoDTO,
  UpdateTalhaoSvgDTO,
} from '@/types/dtos/cemiterios/talhoes.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { TalhaoError } from './talhoes-errors'

export class TalhoesClient extends BaseApiClient {
  public async getTalhoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<TalhaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/talhoes/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<TalhaoDTO>
          >(state.URL, '/client/cemiterios/talhoes/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TalhaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TalhaoError(
            'Falha ao obter talhões de cemitérios paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTalhoes(
    cemiterioId?: string
  ): Promise<ResponseApi<GSResponse<TalhaoDTO[]>>> {
    const url = cemiterioId
      ? `/client/cemiterios/talhoes?cemiterioId=${cemiterioId}`
      : '/client/cemiterios/talhoes'
    const cacheKey = this.getCacheKey('GET', url)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TalhaoDTO[]>
          >(state.URL, url)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TalhaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TalhaoError(
            'Falha ao obter talhões de cemitérios',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTalhao(
    id: string
  ): Promise<ResponseApi<GSResponse<TalhaoDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/cemiterios/talhoes/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TalhaoDTO>
          >(state.URL, `/client/cemiterios/talhoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TalhaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TalhaoError(
            'Falha ao obter talhão de cemitério',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createTalhao(
    data: CreateTalhaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateTalhaoDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/talhoes', data)

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

  public async updateTalhao(
    id: string,
    data: UpdateTalhaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateTalhaoDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/talhoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TalhaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TalhaoError(
          'Falha ao atualizar talhões de cemitérios',
          undefined,
          error
        )
      }
    })
  }

  public async deleteTalhao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/talhoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TalhaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TalhaoError(
          'Falha ao apagar talhão de cemitério',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleTalhoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/talhoes/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TalhaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TalhaoError(
          'Falha ao apagar talhões de cemitérios',
          undefined,
          error
        )
      }
    })
  }

  public async updateTalhaoSvg(
    id: string,
    data: UpdateTalhaoSvgDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.patchRequest<
          UpdateTalhaoSvgDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/talhoes/${id}/svg`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TalhaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TalhaoError(
          'Falha ao atualizar SVG do talhão de cemitério',
          undefined,
          error
        )
      }
    })
  }
}
