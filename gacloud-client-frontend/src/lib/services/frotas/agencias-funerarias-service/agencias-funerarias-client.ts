import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  AgenciaFunerariaDTO,
  CreateAgenciaFunerariaDTO,
  UpdateAgenciaFunerariaDTO,
} from '@/types/dtos/frotas/agencias-funerarias.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { AgenciaFunerariaError } from './agencias-funerarias-errors'

export class AgenciaFunerariaClient extends BaseApiClient {
  public async getAgenciasFunerariasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<AgenciaFunerariaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/agenciasfunerarias/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<AgenciaFunerariaDTO>
          >(
            state.URL,
            '/client/frotas/agenciasfunerarias/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AgenciaFunerariaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AgenciaFunerariaError(
            'Falha ao obter agências funerárias paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAgenciasFunerarias(): Promise<
    ResponseApi<GSResponse<AgenciaFunerariaDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/agenciasfunerarias'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AgenciaFunerariaDTO[]>
          >(state.URL, '/client/frotas/agenciasfunerarias')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AgenciaFunerariaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AgenciaFunerariaError(
            'Falha ao obter agências funerárias',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAgenciaFuneraria(
    id: string
  ): Promise<ResponseApi<GSResponse<AgenciaFunerariaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/agenciasfunerarias/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AgenciaFunerariaDTO>
          >(state.URL, `/client/frotas/agenciasfunerarias/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AgenciaFunerariaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AgenciaFunerariaError(
            'Falha ao obter agência funerária',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createAgenciaFuneraria(
    data: CreateAgenciaFunerariaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateAgenciaFunerariaDTO,
          GSResponse<string>
        >(state.URL, '/client//agenciasfunerarias', data)

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

  public async updateAgenciaFuneraria(
    id: string,
    data: UpdateAgenciaFunerariaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateAgenciaFunerariaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/agenciasfunerarias/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AgenciaFunerariaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AgenciaFunerariaError(
          'Falha ao atualizar agência funerária',
          undefined,
          error
        )
      }
    })
  }

  public async deleteAgenciaFuneraria(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/agenciasfunerarias/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AgenciaFunerariaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AgenciaFunerariaError(
          'Falha ao apagar agência funerária',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleAgenciasFunerarias(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/agenciasfunerarias/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AgenciaFunerariaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AgenciaFunerariaError(
          'Falha ao apagar agências funerárias',
          undefined,
          error
        )
      }
    })
  }
}
