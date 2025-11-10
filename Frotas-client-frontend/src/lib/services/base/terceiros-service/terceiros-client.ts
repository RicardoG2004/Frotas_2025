import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateTerceiroDTO,
  TerceiroDTO,
  UpdateTerceiroDTO,
} from '@/types/dtos/base/terceiros.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { TerceiroError } from './terceiros-errors'

type TerceirosPaginatedRequest = {
  pageNumber: number
  pageSize: number
  filters: Array<{ id: string; value: string }>
  sorting?: Array<{ id: string; desc: boolean }>
}

export class TerceirosClient extends BaseApiClient {
  public async getTerceirosPaginated(
    params: TerceirosPaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<TerceiroDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/terceiros/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            TerceirosPaginatedRequest,
            PaginatedResponse<TerceiroDTO>
          >(state.URL, '/client/base/terceiros/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TerceiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter terceiros paginados:', error)
          throw new TerceiroError(
            'Falha ao obter terceiros paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTerceiros(): Promise<ResponseApi<GSResponse<TerceiroDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/terceiros')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TerceiroDTO[]>
          >(state.URL, '/client/base/terceiros')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TerceiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TerceiroError('Falha ao obter terceiros', undefined, error)
        }
      })
    )
  }

  public async getTerceiro(
    id: string
  ): Promise<ResponseApi<GSResponse<TerceiroDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/terceiros/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TerceiroDTO>
          >(state.URL, `/client/base/terceiros/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TerceiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TerceiroError('Falha ao obter terceiro', undefined, error)
        }
      })
    )
  }

  public async createTerceiro(
    data: CreateTerceiroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateTerceiroDTO,
          GSResponse<string>
        >(state.URL, '/client/base/terceiros', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TerceiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TerceiroError('Falha ao criar terceiro', undefined, error)
      }
    })
  }

  public async updateTerceiro(
    id: string,
    data: UpdateTerceiroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateTerceiroDTO,
          GSResponse<string>
        >(state.URL, `/client/base/terceiros/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TerceiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TerceiroError('Falha ao atualizar terceiro', undefined, error)
      }
    })
  }

  public async deleteTerceiro(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/terceiros/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TerceiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TerceiroError('Falha ao remover terceiro', undefined, error)
      }
    })
  }

  public async deleteMultipleTerceiros(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/terceiros/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TerceiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TerceiroError(
          'Falha ao remover múltiplos terceiros',
          undefined,
          error
        )
      }
    })
  }
}


