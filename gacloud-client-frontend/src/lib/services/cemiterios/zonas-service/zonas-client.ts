import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ZonaDTO,
  CreateZonaDTO,
  UpdateZonaDTO,
  UpdateZonaSvgDTO,
} from '@/types/dtos/cemiterios/zonas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ZonaError } from './zonas-errors'

export class ZonasClient extends BaseApiClient {
  public async getZonasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ZonaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/zonas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ZonaDTO>
          >(state.URL, '/client/cemiterios/zonas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ZonaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ZonaError(
            'Falha ao obter zonas de cemitérios paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getZonas(
    cemiterioId?: string
  ): Promise<ResponseApi<GSResponse<ZonaDTO[]>>> {
    const url = cemiterioId
      ? `/client/cemiterios/zonas?cemiterioId=${cemiterioId}`
      : '/client/cemiterios/zonas'
    const cacheKey = this.getCacheKey('GET', url)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ZonaDTO[]>
          >(state.URL, url)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ZonaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ZonaError(
            'Falha ao obter zonas de cemitérios',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getZona(id: string): Promise<ResponseApi<GSResponse<ZonaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/cemiterios/zonas/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ZonaDTO>
          >(state.URL, `/client/cemiterios/zonas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ZonaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ZonaError(
            'Falha ao obter zona de cemitério',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createZona(
    data: CreateZonaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateZonaDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/zonas', data)

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

  public async updateZona(
    id: string,
    data: UpdateZonaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateZonaDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/zonas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ZonaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ZonaError(
          'Falha ao atualizar zonas de cemitérios',
          undefined,
          error
        )
      }
    })
  }

  public async deleteZona(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/zonas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ZonaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ZonaError(
          'Falha ao apagar zona de cemitério',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleZonas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/zonas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ZonaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ZonaError(
          'Falha ao apagar zonas de cemitérios',
          undefined,
          error
        )
      }
    })
  }

  public async updateZonaSvg(
    id: string,
    data: UpdateZonaSvgDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.patchRequest<
          UpdateZonaSvgDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/zonas/${id}/svg`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ZonaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ZonaError(
          'Falha ao atualizar SVG da zona de cemitério',
          undefined,
          error
        )
      }
    })
  }
}
