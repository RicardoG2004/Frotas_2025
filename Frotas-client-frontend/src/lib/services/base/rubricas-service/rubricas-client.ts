import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateRubricaDTO,
  RubricaDTO,
  UpdateRubricaDTO,
} from '@/types/dtos/base/rubricas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { RubricaError } from './rubricas-errors'

export class RubricasClient extends BaseApiClient {
  public async getRubricasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<RubricaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/rubricas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<RubricaDTO>
          >(state.URL, '/client/base/rubricas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RubricaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RubricaError(
            'Falha ao obter rubricas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getRubricas(
    epocaId?: string
  ): Promise<ResponseApi<GSResponse<RubricaDTO[]>>> {
    const url = epocaId
      ? `/client/base/rubricas?epocaId=${epocaId}`
      : '/client/base/rubricas'
    const cacheKey = this.getCacheKey('GET', url)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<RubricaDTO[]>
          >(state.URL, url)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RubricaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RubricaError('Falha ao obter rubricas', undefined, error)
        }
      })
    )
  }

  public async createRubrica(
    data: CreateRubricaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateRubricaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/rubricas', data)

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

  public async updateRubrica(
    id: string,
    data: UpdateRubricaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateRubricaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/rubricas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RubricaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RubricaError('Falha ao atualizar rubrica', undefined, error)
      }
    })
  }

  public async deleteRubrica(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/rubricas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RubricaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RubricaError('Falha ao apagar rubrica', undefined, error)
      }
    })
  }

  public async deleteMultipleRubricas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/rubricas/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new RubricaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new RubricaError(
          'Falha ao apagar múltiplas rubricas',
          undefined,
          error
        )
      }
    })
  }

  public async getRubrica(
    id: string
  ): Promise<ResponseApi<GSResponse<RubricaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/rubricas/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<RubricaDTO>
          >(state.URL, `/client/base/rubricas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new RubricaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new RubricaError('Falha ao obter rubrica', undefined, error)
        }
      })
    )
  }
}
