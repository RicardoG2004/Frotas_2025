import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  PecaDTO,
  CreatePecaDTO,
  UpdatePecaDTO,
} from '@/types/dtos/frotas/pecas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { PecaError } from './pecas-errors'

export class PecaClient extends BaseApiClient {
  public async getPecasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<PecaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/pecas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<PecaDTO>
          >(
            state.URL,
            '/client/frotas/pecas/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PecaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PecaError(
            'Falha ao obter peças paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPecas(): Promise<
    ResponseApi<GSResponse<PecaDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/pecas'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PecaDTO[]>
          >(state.URL, '/client/frotas/pecas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PecaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PecaError(
            'Falha ao obter peças',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPeca(
    id: string
  ): Promise<ResponseApi<GSResponse<PecaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/pecas/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PecaDTO>
          >(state.URL, `/client/frotas/pecas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PecaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PecaError(
            'Falha ao obter peça',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createPeca(
    data: CreatePecaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreatePecaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/pecas', data)

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

  public async updatePeca(
    id: string,
    data: UpdatePecaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdatePecaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/pecas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PecaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PecaError(
          'Falha ao atualizar peça',
          undefined,
          error
        )
      }
    })
  }

  public async deletePeca(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/pecas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PecaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PecaError(
          'Falha ao apagar peça',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultiplePecas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/pecas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PecaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PecaError(
          'Falha ao apagar peças',
          undefined,
          error
        )
      }
    })
  }
}

