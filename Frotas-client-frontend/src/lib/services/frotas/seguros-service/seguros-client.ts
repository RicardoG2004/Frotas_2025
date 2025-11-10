import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  SeguroDTO,
  CreateSeguroDTO,
  UpdateSeguroDTO,
} from '@/types/dtos/frotas/seguros.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { SeguroError } from './seguros-errors'

export class SegurosClient extends BaseApiClient {
  public async getSegurosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SeguroDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/seguros/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SeguroDTO>
          >(state.URL, '/client/frotas/seguros/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguroError(
            'Falha ao obter seguros paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSeguros(): Promise<ResponseApi<GSResponse<SeguroDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/seguros')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<SeguroDTO[]>>(
              state.URL,
              '/client/frotas/seguros'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguroError(
            'Falha ao obter seguros',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSeguro(
    id: string
  ): Promise<ResponseApi<GSResponse<SeguroDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/seguros/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<SeguroDTO>>(
              state.URL,
              `/client/frotas/seguros/${id}`
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguroError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguroError(
            'Falha ao obter seguro',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createSeguro(
    data: CreateSeguroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSeguroDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/seguros', data)

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

  public async updateSeguro(
    id: string,
    data: UpdateSeguroDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSeguroDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/seguros/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguroError('Falha ao atualizar seguro', undefined, error)
      }
    })
  }

  public async deleteSeguro(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/seguros/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguroError('Falha ao apagar seguro', undefined, error)
      }
    })
  }

  public async deleteMultipleSeguros(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, '/client/frotas/seguros/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguroError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguroError(
          'Falha ao apagar seguros',
          undefined,
          error
        )
      }
    })
  }
}


