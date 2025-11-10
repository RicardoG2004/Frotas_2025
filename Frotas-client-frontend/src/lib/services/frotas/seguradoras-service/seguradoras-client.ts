import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  SeguradoraDTO,
  CreateSeguradoraDTO,
  UpdateSeguradoraDTO,
} from '@/types/dtos/frotas/seguradoras.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { SeguradoraError } from './seguradoras-errors'

export class SeguradorasClient extends BaseApiClient {
  public async getSeguradorasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SeguradoraDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/seguradoras/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SeguradoraDTO>
          >(state.URL, '/client/frotas/seguradoras/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguradoraError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguradoraError(
            'Falha ao obter seguradoras paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSeguradoras(): Promise<
    ResponseApi<GSResponse<SeguradoraDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/seguradoras')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<SeguradoraDTO[]>>(
              state.URL,
              '/client/frotas/seguradoras'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguradoraError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguradoraError(
            'Falha ao obter seguradoras',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSeguradora(
    id: string
  ): Promise<ResponseApi<GSResponse<SeguradoraDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/seguradoras/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<SeguradoraDTO>>(
              state.URL,
              `/client/frotas/seguradoras/${id}`
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SeguradoraError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SeguradoraError(
            'Falha ao obter seguradora',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createSeguradora(
    data: CreateSeguradoraDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSeguradoraDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/seguradoras', data)

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

  public async updateSeguradora(
    id: string,
    data: UpdateSeguradoraDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSeguradoraDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/seguradoras/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguradoraError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguradoraError(
          'Falha ao atualizar seguradora',
          undefined,
          error
        )
      }
    })
  }

  public async deleteSeguradora(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/seguradoras/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguradoraError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguradoraError(
          'Falha ao apagar seguradora',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleSeguradoras(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, '/client/frotas/seguradoras/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SeguradoraError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SeguradoraError(
          'Falha ao apagar seguradoras',
          undefined,
          error
        )
      }
    })
  }
}


