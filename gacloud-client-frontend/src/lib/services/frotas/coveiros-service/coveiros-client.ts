import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CoveiroDTO,
  CreateCoveiroDTO,
  UpdateCoveiroDTO,
} from '@/types/dtos/frotas/coveiros.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CoveiroError } from './coveiros-errors'

export class CoveiroClient extends BaseApiClient {
  public async getCoveirosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CoveiroDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/coveiros/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CoveiroDTO>
          >(state.URL, '/client/frotas/coveiros/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CoveiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CoveiroError(
            'Falha ao obter coveiros paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCoveiros(): Promise<ResponseApi<GSResponse<CoveiroDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/coveiros')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CoveiroDTO[]>
          >(state.URL, '/client/frotas/coveiros')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CoveiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CoveiroError('Falha ao obter coveiros', undefined, error)
        }
      })
    )
  }

  public async getCoveiro(
    id: string
  ): Promise<ResponseApi<GSResponse<CoveiroDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/coveiros/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CoveiroDTO>
          >(state.URL, `/client/frotas/coveiros/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CoveiroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CoveiroError('Falha ao obter coveiro', undefined, error)
        }
      })
    )
  }

  public async createCoveiro(
    data: CreateCoveiroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCoveiroDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/coveiros', data)

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

  public async updateCoveiro(
    id: string,
    data: UpdateCoveiroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCoveiroDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/coveiros/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CoveiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CoveiroError('Falha ao atualizar coveiros', undefined, error)
      }
    })
  }

  public async deleteCoveiro(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/coveiros/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CoveiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CoveiroError('Falha ao apagar coveiro', undefined, error)
      }
    })
  }

  public async deleteMultipleCoveiros(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/coveiros/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CoveiroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CoveiroError('Falha ao apagar coveiros', undefined, error)
      }
    })
  }
}
