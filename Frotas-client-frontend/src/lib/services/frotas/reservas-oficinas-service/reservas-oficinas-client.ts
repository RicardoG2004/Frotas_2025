import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ReservaOficinaDTO,
  CreateReservaOficinaDTO,
  UpdateReservaOficinaDTO,
} from '@/types/dtos/frotas/reservas-oficinas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ReservaOficinaError } from './reservas-oficinas-errors'

export class ReservaOficinaClient extends BaseApiClient {
  public async getReservasOficinasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ReservaOficinaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/reservas-oficinas/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ReservaOficinaDTO>
          >(
            state.URL,
            '/client/frotas/reservas-oficinas/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ReservaOficinaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ReservaOficinaError(
            'Falha ao obter reservas de oficinas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getReservasOficinas(): Promise<
    ResponseApi<GSResponse<ReservaOficinaDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/reservas-oficinas'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ReservaOficinaDTO[]>
          >(state.URL, '/client/frotas/reservas-oficinas')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ReservaOficinaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ReservaOficinaError(
            'Falha ao obter reservas de oficinas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getReservaOficina(
    id: string
  ): Promise<ResponseApi<GSResponse<ReservaOficinaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/reservas-oficinas/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ReservaOficinaDTO>
          >(state.URL, `/client/frotas/reservas-oficinas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ReservaOficinaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ReservaOficinaError(
            'Falha ao obter reserva de oficina',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getReservasOficinasByFuncionario(
    funcionarioId: string
  ): Promise<ResponseApi<GSResponse<ReservaOficinaDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/reservas-oficinas/funcionario/${funcionarioId}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ReservaOficinaDTO[]>
          >(state.URL, `/client/frotas/reservas-oficinas/funcionario/${funcionarioId}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ReservaOficinaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ReservaOficinaError(
            'Falha ao obter reservas de oficinas por funcionário',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getReservasOficinasByDate(
    date: string
  ): Promise<ResponseApi<GSResponse<ReservaOficinaDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/reservas-oficinas/data/${date}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ReservaOficinaDTO[]>
          >(state.URL, `/client/frotas/reservas-oficinas/data/${date}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ReservaOficinaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ReservaOficinaError(
            'Falha ao obter reservas de oficinas por data',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createReservaOficina(
    data: CreateReservaOficinaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        console.log('Enviando POST para:', '/client/frotas/reservas-oficinas', data)
        const response = await this.httpClient.postRequest<
          CreateReservaOficinaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/reservas-oficinas', data)

        console.log('Resposta recebida:', response)
        
        if (!response.info) {
          console.error('Resposta sem info:', response)
          throw new ReservaOficinaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        console.error('Erro ao criar reserva:', error)
        console.error('Erro completo:', JSON.stringify(error, null, 2))
        if (error instanceof BaseApiError && error.data) {
          console.log('Erro data:', error.data)
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

  public async updateReservaOficina(
    id: string,
    data: UpdateReservaOficinaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateReservaOficinaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/reservas-oficinas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ReservaOficinaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ReservaOficinaError(
          'Falha ao atualizar reserva de oficina',
          undefined,
          error
        )
      }
    })
  }

  public async deleteReservaOficina(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/reservas-oficinas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ReservaOficinaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ReservaOficinaError(
          'Falha ao apagar reserva de oficina',
          undefined,
          error
        )
      }
    })
  }
}

