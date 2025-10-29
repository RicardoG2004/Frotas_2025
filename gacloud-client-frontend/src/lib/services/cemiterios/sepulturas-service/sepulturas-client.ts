import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  SepulturaDTO,
  CreateSepulturaDTO,
  UpdateSepulturaDTO,
  UpdateSepulturaSvgDTO,
} from '@/types/dtos/cemiterios/sepulturas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { SepulturaError } from './sepulturas-errors'

export class SepulturasClient extends BaseApiClient {
  public async getSepulturasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SepulturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/sepulturas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SepulturaDTO>
          >(state.URL, '/client/cemiterios/sepulturas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaError(
            'Falha ao obter sepulturas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepulturas(): Promise<
    ResponseApi<GSResponse<SepulturaDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/cemiterios/sepulturas')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaDTO[]>
          >(state.URL, '/client/cemiterios/sepulturas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaError(
            'Falha ao obter sepulturas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepultura(
    id: string
  ): Promise<ResponseApi<GSResponse<SepulturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/sepulturas/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaDTO>
          >(state.URL, `/client/cemiterios/sepulturas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaError('Falha ao obter sepultura', undefined, error)
        }
      })
    )
  }

  public async createSepultura(
    data: CreateSepulturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSepulturaDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/sepulturas', data)

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

  public async updateSepultura(
    id: string,
    data: UpdateSepulturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSepulturaDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/sepulturas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaError(
          'Falha ao atualizar sepultura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteSepultura(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/sepulturas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaError('Falha ao apagar sepultura', undefined, error)
      }
    })
  }

  public async deleteMultipleSepulturas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/sepulturas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaError('Falha ao apagar sepulturas', undefined, error)
      }
    })
  }

  public async updateSepulturaSvg(
    id: string,
    data: UpdateSepulturaSvgDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.patchRequest<
          UpdateSepulturaSvgDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/sepulturas/${id}/svg`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaError(
          'Falha ao atualizar SVG da sepultura',
          undefined,
          error
        )
      }
    })
  }
}
