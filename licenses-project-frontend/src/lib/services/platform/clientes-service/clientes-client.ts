import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import { ClienteDTO, CreateClienteDTO, UpdateClienteDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ClienteError } from './cliente-error'

export class ClientesClient extends BaseApiClient {
  public async getClientesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ClienteDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/clientes/clientes-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ClienteDTO>
          >('/api/clientes/clientes-paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ClienteError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ClienteError(
            'Falha ao obter clientes paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getClientes(): Promise<ResponseApi<GSResponse<ClienteDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/clientes')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ClienteDTO[]>>(
              '/api/clientes'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ClienteError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ClienteError('Falha ao obter clientes', undefined, error)
        }
      })
    )
  }

  public async createCliente(
    data: CreateClienteDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateClienteDTO,
          GSResponse<string>
        >('/api/clientes', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ClienteError('Formato de resposta inválido')
        }

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

  public async updateCliente(
    id: string,
    data: UpdateClienteDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateClienteDTO,
          GSResponse<string>
        >(`/api/clientes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ClienteError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ClienteError('Falha ao atualizar cliente', undefined, error)
      }
    })
  }

  public async deleteCliente(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/clientes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ClienteError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ClienteError('Falha ao deletar cliente', undefined, error)
      }
    })
  }

  public async deleteMultipleClientes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >('/api/clientes/bulk-delete', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ClienteError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ClienteError(
          'Falha ao deletar múltiplos clientes',
          undefined,
          error
        )
      }
    })
  }
}
