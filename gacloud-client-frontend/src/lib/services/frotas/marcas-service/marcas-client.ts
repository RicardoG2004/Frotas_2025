import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  MarcaDTO,
  CreateMarcaDTO,
  UpdateMarcaDTO,
} from '@/types/dtos/frotas/marcas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { MarcaError } from './marcas-errors'

export class MarcasClient extends BaseApiClient {
  public async getMarcasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<MarcaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/marcas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<MarcaDTO>
          >(state.URL, '/client/cemiterios/marcas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new MarcaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new MarcaError(
            'Falha ao obter marcas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getMarcas(): Promise<ResponseApi<GSResponse<MarcaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/cemiterios/marcas')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<MarcaDTO[]>
          >(state.URL, '/client/cemiterios/marcas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new MarcaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new MarcaError('Falha ao obter marcas', undefined, error)
        }
      })
    )
  }

  public async getMarca(
    id: string
  ): Promise<ResponseApi<GSResponse<MarcaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/marcas/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<MarcaDTO>
          >(state.URL, `/client/cemiterios/marcas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new MarcaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new MarcaError('Falha ao obter marca', undefined, error)
        }
      })
    )
  }

  public async createMarca(
    data: CreateMarcaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateMarcaDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/marcas', data)

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

  public async updateMarca(
    id: string,
    data: UpdateMarcaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateMarcaDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/marcas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new MarcaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new MarcaError('Falha ao atualizar marcas', undefined, error)
      }
    })
  }

  public async deleteMarca(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/marcas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new MarcaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new MarcaError('Falha ao apagar marca', undefined, error)
      }
    })
  }

  public async deleteMultipleMarcas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/marcas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new MarcaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new MarcaError('Falha ao apagar marcas', undefined, error)
      }
    })
  }
}
